from datetime import datetime,timedelta

from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS,cross_origin

from models import db
from routes.blogs import blog_bp
from routes.auth import jwt,bcrypt,auth_bp
from routes.main import main_bp
from routes.category import category_bp
from serializer import serializer_bp
from routes.user import user_bp
from routes.media import media_bp
from routes.comment import comment_bp

from dotenv import load_dotenv
import os


def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SECRET_KEY'] =os.getenv('SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES']=timedelta(hours=1)
   
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)   
    migrate = Migrate(app, db)
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)  
    app.register_blueprint(serializer_bp) 
    app.register_blueprint(category_bp)   
    app.register_blueprint(blog_bp)   
    app.register_blueprint(user_bp)    
    app.register_blueprint(media_bp) 
    app.register_blueprint(comment_bp)

  
 
    CORS(app)

    print('Database URI:', app.config['SQLALCHEMY_DATABASE_URI'])
    
    cloudinary_url = os.getenv('CLOUDINARY_URL')
    cloudinary_cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    cloudinary_api_key = os.getenv('CLOUDINARY_API_KEY')
    cloudinary_api_secret = os.getenv('CLOUDINARY_API_SECRET')

    app.config['CLOUDINARY_URL'] = cloudinary_url
    app.config['CLOUDINARY_CLOUD_NAME'] = cloudinary_cloud_name
    app.config['CLOUDINARY_API_KEY'] = cloudinary_api_key
    app.config['CLOUDINARY_API_SECRET'] = cloudinary_api_secret


    

    return app
app=create_app()


