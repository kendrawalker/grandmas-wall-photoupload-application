
DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INTEGER,
    comment TEXT,
    commenter VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (image_id, comment, commenter) VALUES (1, 'I heart Berlin', 'kenDrawks');
INSERT INTO comments (image_id, comment, commenter) VALUES (2, 'Aint nuthin but a hounddog', 'kenDrawks');
INSERT INTO comments (image_id, comment, commenter) VALUES (3, 'Why hello there Lil Kitty', 'kenDrawks');
