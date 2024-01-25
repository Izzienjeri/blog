from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin




metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
#postgres://blogs_db_80lt_user:EffqJTVUWcZWSJgMzQpRBdIVTBcf1UOl@dpg-cmp6etvqd2ns738ouf8g-a.oregon-postgres.render.com/blogs_db_80lt
db = SQLAlchemy(metadata=metadata)

class User(db.Model,SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    firstname=db.Column(db.String(80), nullable=False)
    lastname=db.Column(db.String(80),nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile_image = db.Column(db.String(255))
    blogs = db.relationship('BlogPost', backref='user_blog')
    comments = db.relationship('Comment', backref='user_comment')

    def __repr__(self):
        return f"<User {self.username}>"
    



class BlogPost(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    excerpt=db.Column(db.String,nullable=False)
    content = db.Column(db.Text, nullable=False)
    pub_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comments = db.relationship('Comment', backref='post_comment')
    images = db.relationship('Media', backref='post_image')
    categories = db.relationship('Category', secondary='blogs_categories', back_populates='posts')

    
    def __repr__(self):
        return f"<Blog {self.title}>"


class Media(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)

    def __repr__(self):
        return f"<image {self.file_path}>"

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    guest_name = db.Column(db.String(100))
    is_guest = db.Column(db.Boolean, default=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Comment {self.id} by {self.user.username if self.user else self.guest_name}>"

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    posts = db.relationship('BlogPost', secondary='blogs_categories', back_populates='categories')
    def __repr__(self):
        return f"<Category {self.name}>"
    
class TokenBlocklist(db.Model):
    __tablename__='tokenblocklist'
    id = db.Column(db.Integer, primary_key=True)
    jti= db.Column(db.String(36),nullable=False, index=True)
    created_at=db.Column(db.DateTime,nullable=False)


blogs_categories = db.Table(
    'blogs_categories',
    db.Column('blog_id', db.ForeignKey('posts.id'), primary_key=True),
    db.Column('category_id', db.ForeignKey('categories.id'), primary_key=True),
    extend_existing=True
)
