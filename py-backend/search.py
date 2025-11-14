import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import openai

from dotenv import load_dotenv
# Load environment variables
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# Initialize the Flask application
app = Flask(__name__)
# Allow CORS for your Next.js app
CORS(app, resources={r"/*": {
    "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Set your OpenAI API key
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Load the pre-computed embeddings and product data
df = pd.read_pickle('product_embeddings.pkl')

print("Flask app initialized, libraries imported, and product data loaded.")

def get_embedding(text, model="text-embedding-ada-002"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

print("'get_embedding' function re-defined for the Flask application.")

def semantic_search(query, df, top_n=5):
    query_embedding = get_embedding(query)

    # Convert embeddings to numpy arrays
    product_embeddings = np.array(df['embedding'].tolist())
    query_embedding_np = np.array(query_embedding).reshape(1, -1)

    # Calculate cosine similarity
    similarities = cosine_similarity(query_embedding_np, product_embeddings).flatten()

    # Get indices of top N most similar products
    top_indices = similarities.argsort()[-top_n:][::-1]

    # Retrieve relevant product details and similarity scores
    results = []
    for i in top_indices:
        results.append({
            'sku_id': df.loc[i, 'sku_id'],
            'product_name': df.loc[i, 'product_name'],
            'description': df.loc[i, 'description'],
            'price': df.loc[i, 'price'],
            'rating':  df.loc[i, 'rating'],
            'similarity_score': similarities[i],
            'image_url': df.loc[i, 'images']
        })
    return results

print("Semantic search function 'semantic_search' re-defined for the Flask application.")

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query')
    top_n = data.get('top_n', 10) # Default to 10 if not provided

    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    results = semantic_search(query, df, top_n=top_n)
    return jsonify(results)

print("'/search' API endpoint created.")    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

print("Flask application run block added. The application will start when executed.")