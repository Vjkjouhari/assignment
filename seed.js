const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

const User = require("./models/User");
const Notification = require("./models/Notification");
const Post = require("./models/Post");
const Follow = require("./models/Follow");

const TOTAL_USERS = 10;
const TOTAL_POSTS = 40;
const TOTAL_NOTIFICATIONS = 100;
const TOTAL_FOLLOWS = 10;

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Clear existing data
    await User.deleteMany({});
    await Notification.deleteMany({});
    await Post.deleteMany({});
    await Follow.deleteMany({});
    console.log("🧹 Cleared old data");

    // Seed users
    const fakeUsers = Array.from({ length: TOTAL_USERS }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
    }));
    const createdUsers = await User.insertMany(fakeUsers);
    console.log(`✅ Inserted ${createdUsers.length} users`);

    // Seed notifications
    const fakeNotifications = [];
    for (let i = 0; i < TOTAL_NOTIFICATIONS; i++) {
      const recipient = faker.helpers.arrayElement(createdUsers);
      const sender = faker.helpers.arrayElement(createdUsers);
      if (recipient._id.equals(sender._id)) continue;

      fakeNotifications.push({
        recipientId: recipient._id,
        message: `${sender.name} commented on your post`,
        createdAt: faker.date.recent(),
      });
    }
    await Notification.insertMany(fakeNotifications);
    console.log(`✅ Inserted ${fakeNotifications.length} notifications`);

    // Seed follows
    const fakeFollows = new Set();
    while (fakeFollows.size < TOTAL_FOLLOWS) {
      const follower = faker.helpers.arrayElement(createdUsers);
      const following = faker.helpers.arrayElement(createdUsers);

      if (follower._id.equals(following._id)) continue;
      fakeFollows.add(`${follower._id}-${following._id}`);
    }

    const followDocs = Array.from(fakeFollows).map((pair) => {
      const [followerId, followingId] = pair.split("-");
      return {
        follower: followerId,
        following: followingId,
      };
    });
    await Follow.insertMany(followDocs);
    console.log(`✅ Inserted ${followDocs.length} follow relationships`);

    // Seed posts
    const fakePosts = [];
    for (let i = 0; i < TOTAL_POSTS; i++) {
      const author = faker.helpers.arrayElement(createdUsers);

      const imageUrl = `https://picsum.photos/200/300?random=${faker.number.int(
        { min: 1, max: 1000 }
      )}`;

      const likeUsers = faker.helpers.arrayElements(
        createdUsers,
        faker.number.int({ min: 0, max: 10 })
      );
      const dislikeUsers = faker.helpers.arrayElements(
        createdUsers.filter((u) => !likeUsers.some((l) => l._id.equals(u._id))),
        faker.number.int({ min: 0, max: 5 })
      );

      const comments = Array.from({
        length: faker.number.int({ min: 0, max: 5 }),
      }).map(() => ({
        user: faker.helpers.arrayElement(createdUsers)._id,
        text: faker.lorem.sentence(),
        createdAt: faker.date.recent(),
      }));

      fakePosts.push({
        author: author._id,
        content: faker.lorem.paragraph(),
        image: imageUrl,
        likes: likeUsers.map((u) => u._id),
        dislikes: dislikeUsers.map((u) => u._id),
        comments,
        createdAt: faker.date.recent(),
      });
    }

    await Post.insertMany(fakePosts);
    console.log(` Inserted ${fakePosts.length} posts`);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected after seeding");
  }
}

seedUsers();
