import mongoose from 'mongoose';
import User from './models/User.js';
import Lead from './models/Lead.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample data
const firstNames = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Maria'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const companies = ['TechCorp', 'InnovateInc', 'GlobalSolutions', 'NextGen', 'FutureTech', 'CloudSystems', 'DataWorks', 'SmartSoft', 'DigitalCraft', 'WebMasters'];
const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost'];
const sources = ['website', 'referral', 'social_media', 'email_campaign', 'event', 'other'];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Lead.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    });
    await adminUser.save();

    // Create sales user
    const salesUser = new User({
      email: 'sales@example.com',
      password: 'sales123',
      name: 'Sales Representative',
      role: 'sales'
    });
    await salesUser.save();

    // Generate 1000 dummy leads
    const leads = [];
    const startDate = new Date(2023, 0, 1); // Jan 1, 2023
    const endDate = new Date(); // Today
    
    for (let i = 0; i < 1000; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      // Random date between startDate and endDate
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      
      const lead = {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        company,
        status,
        source,
        value: Math.floor(Math.random() * 10000) + 1000,
        notes: `Lead generated for ${company}. Interested in our services.`,
        assignedTo: Math.random() > 0.5 ? adminUser._id : salesUser._id,
        lastContacted: new Date(randomDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last 7 days from creation
        createdAt: randomDate,
        updatedAt: randomDate
      };
      
      leads.push(lead);
    }

    // Insert all leads
    await Lead.insertMany(leads);
    console.log(`Successfully seeded ${leads.length} leads`);

    // Show some statistics
    const leadCount = await Lead.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log('Seeding completed!');
    console.log(`Total leads: ${leadCount}`);
    console.log(`Total users: ${userCount}`);
    console.log('\nDemo credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('Sales - Email: sales@example.com, Password: sales123');

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();