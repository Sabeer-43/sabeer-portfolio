import os
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Use PostgreSQL on Render, fallback to SQLite locally
database_url = os.environ.get('DATABASE_URL', 'sqlite:///database.db')

# Render gives postgres:// but SQLAlchemy needs postgresql://
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(20), default=lambda: datetime.now().strftime("%d/%m/%Y"))

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/messages', methods=['GET'])
def get_messages():
    messages = Message.query.order_by(Message.id.desc()).all()
    return jsonify([{'name': m.name, 'message': m.message, 'date': m.date} for m in messages])

@app.route('/api/messages', methods=['POST'])
def post_message():
    data = request.json
    new_msg = Message(name=data['name'], email=data['email'], message=data['message'])
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({'status': 'success'}), 201

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
