import os
import sqlite3
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
from io import BytesIO
import replicate
from dotenv import load_dotenv

# ---------------- CONFIG ---------------- #

DB_PATH = "hackathon_test.db"

# Load environment variables from .env
load_dotenv()
replicate_token = os.getenv("REPLICATE_API_TOKEN")

if not replicate_token:
    print("⚠️ WARNING: REPLICATE_API_TOKEN is not set. "
          "Replicate calls will fail with authentication error.")
else:
    os.environ["REPLICATE_API_TOKEN"] = replicate_token

# Full Replicate model identifier (model:version)
REPLICATE_MODEL = (
    "krthr/clip-embeddings:"
    "1c0371070cb827ec3c7f2f28adcdde54b50dcd239aa6faea0bc98b174ef03fb4"
)

# ---------------- FLASK SETUP ---------------- #

app = Flask(__name__)
CORS(app)

# ---------------- Database Loader ---------------- #

def load_products_from_db():
    """
    Returns:
      meta   = list of dicts (sku_id, product_name, description, image_url)
      matrix = np.ndarray shape (N, D) of embedding vectors
    """
    print(f"🔌 Connecting to DB at: {os.path.abspath(DB_PATH)}")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Adjust table/column names if different
    cur.execute(
        "SELECT sku_id, product_name, description, images, price, rating, vectors "
        "FROM skus_test WHERE vectors IS NOT NULL"
    )
    rows = cur.fetchall()
    conn.close()

    print(f"📄 Fetched {len(rows)} rows from skus_test")

    meta = []
    vectors = []

    for sku_id, name, desc, img,price,rating, vect in rows:
        if vect is None:
            continue

        # CASE 1: embedding stored as BLOB (bytes)
        if isinstance(vect, (bytes, bytearray, memoryview)):
            vec = np.frombuffer(vect, dtype="float32")

        # CASE 2: embedding stored as TEXT (JSON string or comma-separated)
        elif isinstance(vect, str):
            vstr = vect.strip()
            try:
                if vstr.startswith("[") and vstr.endswith("]"):
                    # JSON list: "[0.1, 0.2, ...]"
                    vec_list = json.loads(vstr)
                else:
                    # fallback: "0.1,0.2,0.3"
                    vec_list = [
                        float(x) for x in vstr.split(",") if x.strip() != ""
                    ]
                vec = np.array(vec_list, dtype="float32")
            except Exception as e:
                print(f"⚠️ Could not parse vectors for sku_id={sku_id}: {e}")
                continue

        else:
            print(f"⚠️ Unsupported vectors type for sku_id={sku_id}: {type(vect)}")
            continue

        if vec.size == 0:
            continue

        meta.append(
            {
                "sku_id": sku_id,
                "product_name": name,
                "description": desc,
                "image_url": img,
                "price": price,
                "rating": rating,
            }
        )
        vectors.append(vec)

    if not vectors:
        print("❌ No valid embeddings loaded from DB. "
              "Check that 'vectors' column is populated.")
        return [], np.zeros((0, 1), dtype="float32")

    matrix = np.vstack(vectors)  # (N, D)
    return meta, matrix


print("📦 Loading embeddings from SQLite...")
META, MATRIX = load_products_from_db()
print(f"✅ Loaded {len(META)} product vectors.")


# ---------------- EMBEDDING FROM IMAGE ---------------- #

def get_embedding_from_image(image_bytes: bytes) -> np.ndarray:
    """Get L2-normalized image embedding from Replicate CLIP model."""
    if not replicate_token:
        raise RuntimeError("REPLICATE_API_TOKEN not set; cannot call Replicate.")
    # Open and process
    img = Image.open(BytesIO(image_bytes)).convert("RGB")

    # Save to buffer
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    
    output = replicate.run(
        REPLICATE_MODEL,
        input={"image": buffer},
    )

    print(output)

    # This model returns a dict with key "embedding"
    emb = np.array(output["embedding"], dtype=np.float32)

    # Normalize for cosine similarity
    norm = np.linalg.norm(emb)
    if norm > 0:
        emb = emb / norm

    return emb


# ---------------- SEMANTIC SEARCH ---------------- #

def semantic_search(image_bytes: bytes, top_n: int = 5):
    print("here")
    if MATRIX.shape[0] == 0:
        raise RuntimeError("No embeddings loaded in memory. "
                           "Check DB 'vectors' column.")

    query_emb = get_embedding_from_image(image_bytes).reshape(1, -1)

    similarities = cosine_similarity(query_emb, MATRIX).flatten()

    # Always return at least 5, but not more than we have
    top_n = max(top_n, 8)
    top_n = min(top_n, MATRIX.shape[0])

    indices = similarities.argsort()[-top_n:][::-1]

    results = []
    for idx in indices:
        item = dict(META[idx])  # copy so we don't mutate global META
        item["similarity_score"] = float(similarities[idx])
        results.append(item)

    return results


# ---------------- API ROUTE ---------------- #
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"}), 200

@app.route("/search-image", methods=["POST"])
def search_image():
    print("----- DEBUG REQUEST -----")
    print("Request method:", request.method)
    print("Content-Type:", request.headers.get("Content-Type"))
    print("Form keys:", list(request.form.keys()))
    print("Files keys:", list(request.files.keys()))
    print("-------------------------")
    if "file" not in request.files:
        return jsonify({"error": "Missing file"}), 400

    file = request.files["file"]
    image_bytes = file.read()

    try:
        top_n = int(request.form.get("top_n", 5))
    except ValueError:
        top_n = 5

    try:
        results = semantic_search(image_bytes, top_n=top_n)
        return results
    except Exception as e:
        # Surface real error instead of silent SystemExit-style behavior
        return jsonify({"error": str(e)}), 500


# ---------------- MAIN ---------------- #

if __name__ == "__main__":
    print("🚀 Running Image Semantic Search API on port 5000...")
    app.run(host="0.0.0.0", port=5001, debug=True)
