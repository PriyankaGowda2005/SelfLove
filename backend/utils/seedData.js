// backend/utils/seedData.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Habit = require('../models/Habit');
const Task = require('../models/Task');
const Journal = require('../models/Journal');

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://priyanka636192:Priyanka@cluster0.hqrqzgl.mongodb.net/SelfLove';
    
    // Ensure we're connecting to the SelfLove database
    const finalURI = mongoURI.includes('srp-crm') 
      ? mongoURI.replace('srp-crm', 'SelfLove')
      : mongoURI;
    
    await mongoose.connect(finalURI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Habit.deleteMany({});
    await Task.deleteMany({});
    await Journal.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const sampleUser = await User.create({
      username: 'demouser',
      email: 'demo@example.com',
      password: hashedPassword,
      points: 500,
      badges: [
        { name: 'First Steps', description: 'Complete your first habit', icon: '👟', earnedAt: new Date() },
        { name: '1 Week Warrior', description: '7 day habit streak', icon: '🔥', earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      ],
      stats: { totalHabitsCompleted: 15, totalTasksCompleted: 8, totalJournalEntries: 5, longestStreak: 7 }
    });

    const sampleHabits = [
      { title: 'Morning Exercise', description: '30 minutes of physical activity', color: '#EF4444', icon: '🏃‍♂️', user: sampleUser._id, completedDates: [ { date: new Date(Date.now() - 1 * 86400000) }, { date: new Date(Date.now() - 2 * 86400000) }, { date: new Date(Date.now() - 3 * 86400000) } ], currentStreak: 3, bestStreak: 7 },
      { title: 'Read 30 Minutes', description: 'Daily reading habit', color: '#3B82F6', icon: '📚', user: sampleUser._id, completedDates: [ { date: new Date(Date.now() - 1 * 86400000) }, { date: new Date(Date.now() - 2 * 86400000) } ], currentStreak: 2, bestStreak: 5 },
      { title: 'Meditation', description: '10 minutes of mindfulness', color: '#10B981', icon: '🧘‍♀️', user: sampleUser._id, completedDates: [ { date: new Date(Date.now() - 1 * 86400000) } ], currentStreak: 1, bestStreak: 3 },
      { title: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day', color: '#06B6D4', icon: '💧', user: sampleUser._id, completedDates: [], currentStreak: 0, bestStreak: 2 }
    ];
    await Habit.insertMany(sampleHabits);

    const sampleTasks = [
      { title: 'Complete project proposal', description: 'Finish the Q4 project proposal document', priority: 'high', category: 'work', dueDate: new Date(Date.now() + 2 * 86400000), points: 25, user: sampleUser._id, tags: ['work', 'urgent'] },
      { title: 'Call mom', description: 'Weekly check-in call', priority: 'medium', category: 'personal', points: 10, user: sampleUser._id, tags: ['family'] },
      { title: 'Grocery shopping', description: 'Buy ingredients for this week\'s meals', priority: 'medium', category: 'household', completed: true, completedAt: new Date(Date.now() - 1 * 86400000), points: 15, user: sampleUser._id, tags: ['shopping', 'food'] },
      { title: 'Schedule dentist appointment', description: 'Book routine cleaning appointment', priority: 'low', category: 'health', points: 10, user: sampleUser._id, tags: ['health', 'appointment'] },
      { title: 'Update resume', description: 'Add recent projects and skills', priority: 'medium', category: 'career', completed: true, completedAt: new Date(Date.now() - 3 * 86400000), points: 20, user: sampleUser._id, tags: ['career', 'professional'] }
    ];
    await Task.insertMany(sampleTasks);

    const sampleJournals = [
      { title: 'Great Day at Work', content: 'Today was incredibly productive at work. I managed to complete the client presentation and received positive feedback from the team. The new project looks promising and I\'m excited about the challenges ahead. Sometimes it\'s the small wins that make the biggest difference.', mood: 'happy', moodScore: 4, user: sampleUser._id, tags: ['work', 'productivity', 'success'], weather: 'sunny' },
      { title: 'Reflection on Goals', content: 'Been thinking about my personal goals lately. It\'s important to take time to reflect on where I am and where I want to be. The habit tracking has been really helpful in building consistency. I need to focus more on my health and fitness goals in the coming weeks.', mood: 'neutral', moodScore: 3, user: sampleUser._id, createdAt: new Date(Date.now() - 2 * 86400000), tags: ['goals', 'reflection', 'planning'] },
      { title: 'Challenging Day', content: 'Today was tough. Work was stressful and I felt overwhelmed with all the deadlines. But I managed to stick to my meditation habit, which helped me center myself. It\'s days like these that remind me why self-care routines are so important.', mood: 'sad', moodScore: 2, user: sampleUser._id, createdAt: new Date(Date.now() - 4 * 86400000), tags: ['stress', 'work', 'mindfulness'], weather: 'rainy' },
      { title: 'Weekend Adventures', content: 'Had an amazing weekend hiking with friends. The weather was perfect and the views were breathtaking. These outdoor activities always recharge my energy and remind me of what\'s truly important in life. Planning to make this a regular weekend activity.', mood: 'very_happy', moodScore: 5, user: sampleUser._id, createdAt: new Date(Date.now() - 6 * 86400000), tags: ['hiking', 'friends', 'outdoor', 'adventure'], weather: 'sunny' },
      { title: 'Learning Something New', content: 'Started learning a new programming framework today. It\'s challenging but exciting. I love the feeling of acquiring new skills and expanding my knowledge. The online course is well-structured and the community is very supportive.', mood: 'happy', moodScore: 4, user: sampleUser._id, createdAt: new Date(Date.now() - 7 * 86400000), tags: ['learning', 'programming', 'growth', 'education'] }
    ];
    await Journal.insertMany(sampleJournals);

    console.log('✅ Sample data seeded successfully!');
    console.log('Login with: demo@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

if (require.main === module) {
  runSeed();
}

module.exports = { seedData };


