from flask import Blueprint, make_response, jsonify, request, session
from flask_jwt_extended import jwt_required
from flask_restful import Api, Resource, reqparse,abort
from sqlalchemy.exc import SQLAlchemyError



from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from flask_marshmallow import Marshmallow
from models import db,User,BlogPost,Comment,Category,Media,blogs_categories,TokenBlocklist
main_bp=Blueprint('main',__name__)
api=Api(main_bp)
ma=Marshmallow(main_bp)