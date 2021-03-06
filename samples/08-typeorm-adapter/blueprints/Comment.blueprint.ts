import { TypeormBlueprint } from '@entity-factory/typeorm';
import { Comment } from '../entities/Comment.entity';
import { Post } from '../entities/Post.entity';
import { User } from '../entities/User.entity';

export class CommentBlueprint extends TypeormBlueprint<Comment> {
    constructor() {
        super();

        this.type(Comment);

        this.define(async (faker) => ({
            body: faker.lorem.sentences(2),
        }));

        this.state('with-user', async (faker) => ({
            user: async (factory) => factory.for(User).create(),
        }));

        this.state('with-post', async (faker) => ({
            user: async (factory) => factory.for(Post).create(),
        }));
    }
}
