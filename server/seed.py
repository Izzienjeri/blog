from models import Category,Comment,Media,BlogPost,User,blogs_categories
from datetime import datetime
from app import create_app
from models import db
import os
from dotenv import load_dotenv
load_dotenv()

app = create_app()

def seed_database():
  
  with app.app_context():
    Category.query.delete()
    Comment.query.delete()
    Media.query.delete()
    BlogPost.query.delete()
    User.query.delete()
    db.session.query(blogs_categories).delete()
    db.create_all()

    user_data=[
        
    {
        'username': 'john_doe',
        'firstname': 'John',
        'lastname': 'Doe',
        'email': 'john.doe@example.com',
        'password': 'hashed_password_1',
        'profile_image': 'profile1.jpg'
    },
    {
        'username': 'jane_smith',
        'firstname': 'Jane',
        'lastname': 'Smith',
        'email': 'jane.smith@example.com',
        'password': 'hashed_password_2',
        'profile_image': 'profile2.jpg'
    },
    {
        'username': 'alice_jones',
        'firstname': 'Alice',
        'lastname': 'Jones',
        'email': 'alice.jones@example.com',
        'password': 'hashed_password_3',
        'profile_image': 'profile3.jpg'
    },
    {
        'username': 'bob_jackson',
        'firstname': 'Bob',
        'lastname': 'Jackson',
        'email': 'bob.jackson@example.com',
        'password': 'hashed_password_4',
        'profile_image': 'profile4.jpg'
    },
    {
        'username': 'emma_watson',
        'firstname': 'Emma',
        'lastname': 'Watson',
        'email': 'emma.watson@example.com',
        'password': 'hashed_password_5',
        'profile_image': 'profile5.jpg'
    }
]

    
    

    for user in user_data:
        new_user=User(**user)
        db.session.add(new_user)
        db.session.commit()
  
    blog_post_data = [
    {
        "id": 1,
        "title": "Unraveling the Neural Networks",
        "content": "Embark on a fascinating journey into the intricate details of neural networks and their diverse applications. In this exploration, we delve deep into the underlying mechanisms that drive these artificial intelligence marvels. From the fundamentals of perceptrons to the complexities of deep learning architectures, discover the transformative power that neural networks hold in reshaping our digital landscape. Uncover real-world applications, from image and speech recognition to natural language processing. Join us in unraveling the secrets of neural networks and their profound impact on technology and society.",
        "excerpt": "Dive into the captivating world of neural networks and explore their transformative power in reshaping technology and society.",
        "pub_date": datetime.utcnow(),
        "user_id": 1
    },
    {
        "id": 2,
        "title": "Cognitive Machines at Work",
        "content": "Embark on an immersive journey into the world of cognitive computing and witness how machines emulate human thought processes. This deep dive explores the synergy between artificial intelligence and the intricacies of human cognition. From pattern recognition to problem-solving, discover the parallels between machines and the human mind. Explore real-world applications of cognitive computing, from smart assistants to advanced decision-making systems. Join us in unraveling the mysteries of machine intelligence and its profound impact on shaping the future of technology and human-machine interaction.",
        "excerpt": "Explore the intriguing synergy between machines and human thought in this immersive journey into the world of cognitive computing.",
        "pub_date": datetime.utcnow(),
        "user_id": 2
    },
    {
        "id": 3,
        "title": "The Quantum Leap in AI",
        "content": "Embark on an enlightening journey to understand the potential impact of quantum computing on the dynamic field of artificial intelligence. Explore the quantum realm of AI, where traditional computing boundaries are pushed to new frontiers. Dive into the principles of quantum mechanics and how they intertwine with the foundations of AI algorithms. Uncover the promises and challenges of quantum AI, from enhanced computational power to revolutionary advancements in machine learning. Join us on this quantum leap, as we explore the future possibilities that arise at the intersection of quantum computing and artificial intelligence.",
        "excerpt": "Embark on a fascinating journey through the quantum realm of AI and explore the potential impact of quantum computing on the field of artificial intelligence.",
        "pub_date": datetime.utcnow(),
        "user_id": 1
    },
    {
        "id": 4,
        "title": "Revolutionizing Tech with AI",
        "content": "Embark on a comprehensive exploration of how artificial intelligence is reshaping various industries and technological landscapes. Witness the unfolding revolution fueled by the transformative capabilities of AI. From automation and predictive analytics to personalized user experiences, delve into the myriad ways AI is driving innovation. Explore case studies of industries experiencing paradigm shifts, from healthcare to finance. Join us in understanding the profound implications of the AI revolution and how it is poised to redefine the future of technology and human-machine collaboration.",
        "excerpt": "Witness the unfolding revolution fueled by the transformative capabilities of artificial intelligence in this comprehensive exploration of how AI is reshaping industries and technological landscapes.",
        "pub_date": datetime.utcnow(),
        "user_id": 3
    },
    {
        "id": 5,
        "title": "The AI Odyssey Continues",
        "content": "Embark on a journey through the latest advancements and groundbreaking discoveries in the ever-evolving world of artificial intelligence. Navigate the frontiers of AI research, from novel algorithms to breakthrough applications. Stay informed about cutting-edge developments that shape the ongoing AI odyssey. Explore the societal impacts and ethical considerations surrounding AI, as we navigate the complex landscape of technological progress. Join us in this continuous exploration of the AI frontier, where each discovery paves the way for the future of intelligent systems and their integration into our daily lives.",
        "excerpt": "Join the ongoing AI odyssey as we navigate the ever-evolving world of artificial intelligence, staying informed about cutting-edge breakthroughs and societal impacts.",
        "pub_date": datetime.utcnow(),
        "user_id": 2
    },
    ]
    for post in blog_post_data:
            new_blog=BlogPost(**post)
            db.session.add(new_blog)
            db.session.commit()

    cloudinary_base_url = os.getenv("CLOUDINARY_URL")

    image_data = [

    {
        "file_path":"https://res.cloudinary.com/docmkvwu5/image/upload/v1704991838/kgd1yzewnzbyjvrt7vni.jpg",
        "description": "AI to the World",
        "post_id": 1
    },
    {
        "file_path": "https://res.cloudinary.com/docmkvwu5/image/upload/v1704993987/lvphhedzkwqmqv76cg2h.jpg",
        "description": "Machine Robotics",
        "post_id": 1
    },
    {
        "file_path": "https://res.cloudinary.com/docmkvwu5/image/upload/v1704992388/uzd64cqzyilcnuzhl7g5.jpg",
        "description": "Ai Robots",
        "post_id": 3
    },
    {
        "file_path": "https://res.cloudinary.com/docmkvwu5/image/upload/v1704993987/lvphhedzkwqmqv76cg2h.jpg",
        "description": "AI Machine Learning",
        "post_id": 2
    },
    {
        "file_path": "https://res.cloudinary.com/docmkvwu5/image/upload/v1704993987/lvphhedzkwqmqv76cg2h.jpg",
        "description": "AI Learning Models",
        "post_id": 2
    },
    {
        "file_path": "https://res.cloudinary.com/docmkvwu5/image/upload/v1704994936/rvtveuvgctivo8tbpfwb.jpg",
        "description": "Models Ai",
        "post_id": 4
    },
    {
        "file_path": "https://res.cloudinary.com/docmkvwu5/image/upload/v1704994309/f6olt7ftiuzp8wyxsddy.jpg",
        "description": "Ai Basics",
        "post_id": 5
    },
]

    for image_info in image_data:
        post_id = image_info.pop("post_id")
        post = BlogPost.query.filter_by(id=post_id).first()

        if post:
            new_image = Media(**image_info)
            post.images.append(new_image)
            db.session.add(new_image)

    db.session.commit()


    comment_data=[
        {
            "id": 1,
            "content": "Great post! I love how AI is transforming various industries.",
            "user_id": 1,
            "guest_name": "Guest123",
            "is_guest": False,
            "post_id": 1,
            "created_at": datetime.utcnow()
        },
        {
            "id": 2,
            "content": "Artificial Intelligence has immense potential for improving healthcare",
            "user_id": 2,
            "guest_name": None,
            "is_guest": False,
            "post_id": 1,
            "created_at": datetime.utcnow()
        },
        {
            "id": 3,
            "content": "As a guest, I'm fascinated by the advancements in AI. Keep up the good work!",
            "user_id": 5,
            "guest_name": "None",
            "is_guest": False,
            "post_id": 2,
            "created_at": datetime.utcnow()
        },
        {
            "id": 4,
            "content": "The ethical considerations in AI development are crucial. What are your thoughts?",
            "user_id": 3,
            "guest_name": None,
            "is_guest": False,
            "post_id": 2,
            "created_at": datetime.utcnow()
        },
        {
            "id": 5,
            "content": "Ai is changing the world",
            "user_id": 4,
            "guest_name": None,
            "is_guest": False,
            "post_id": 3,
            "created_at": datetime.utcnow()
        },
    
    ]
    for comment in comment_data:
        new_comment=Comment(**comment)
        db.session.add(new_comment)
        db.session.commit()

    category_data=[
        {
            "id": 1,
            "name": "ML Basics",
            "description": "Introduction to fundamental concepts in machine learning.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 2,
            "name": "NLP",
            "description": "Exploring techniques for processing and understanding human language.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 3,
            "name": "Computer Vision",
            "description": "Understanding and interpreting visual information by computers.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 4,
            "name": "Reinforcement Learning",
            "description": "Learning through trial and error, with a focus on decision-making.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 5,
            "name": "Neural Networks",
            "description": "In-depth exploration of artificial neural networks and deep learning models.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

    ]
    for category in category_data:
        new_category=Category(**category)
        db.session.add(new_category)
        db.session.commit()

    blogs_categories_data=[
        {
            "blog_id": 1,
            "category_id": 3,
        },
        {
            "blog_id": 2,
            "category_id": 1,
        },
        {
            "blog_id": 3,
            "category_id": 5,
        },
        {
            "blog_id": 4,
            "category_id": 2,
        },
        {
            "blog_id": 5,
            "category_id": 4,
        },
    ]

    for entry in blogs_categories_data:
        blog_post = db.session.query(BlogPost).filter_by(id=entry["blog_id"]).first()
        single_category = db.session.query(Category).filter_by(id=entry["category_id"]).first()
        blog_post.categories.append(single_category)
        db.session.commit()

        

if __name__=="__main__":
  seed_database()
