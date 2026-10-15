const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const DiagnosticTest = require('../models/DiagnosticTest');
const TestBooking = require('../models/TestBooking');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const Report = require('../models/Report');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

const doctorSeedData = [
  // 1. General Physician
  {
    name: 'Dr. Arun Kumar',
    qualification: 'MBBS, MD (General Medicine)',
    experience: 12,
    phone: '+91-90000-10001',
    email: 'arun.kumar@example.com',
    consultationFee: 500,
    specialization: 'General Physician',
    gender: 'Male',
    biography: 'Expert in general medicine, fever diagnosis, seasonal infections, and chronic disease management.',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Priya Menon',
    qualification: 'MBBS, MD (General Medicine)',
    experience: 9,
    phone: '+91-90000-10002',
    email: 'priya.menon@example.com',
    consultationFee: 450,
    specialization: 'General Physician',
    gender: 'Female',
    biography: 'Specialist in diabetes care, hypertension, preventive wellness screenings, and adult health.',
    profileImage: 'https://images.unsplash.com/photo-1594824813566-7885a3961cdc?auto=format&fit=crop&q=80&w=300'
  },
  // 2. Pediatrician
  {
    name: 'Dr. Rahul Sharma',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 14,
    phone: '+91-90000-10003',
    email: 'rahul.sharma@example.com',
    consultationFee: 600,
    specialization: 'Pediatrician',
    gender: 'Male',
    biography: 'Dedicated child specialist focusing on newborn care, vaccinations, pediatric infections, and growth monitoring.',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Meena Raj',
    qualification: 'MBBS, DNB (Pediatrics)',
    experience: 10,
    phone: '+91-90000-10004',
    email: 'meena.raj@example.com',
    consultationFee: 550,
    specialization: 'Pediatrician',
    gender: 'Female',
    biography: 'Experienced pediatrician specializing in child growth & nutrition, childhood allergies, and adolescent health.',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  // 3. Orthopedic
  {
    name: 'Dr. Karthik Anand',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 15,
    phone: '+91-90000-10005',
    email: 'karthik.anand@example.com',
    consultationFee: 700,
    specialization: 'Orthopedic',
    gender: 'Male',
    biography: 'Senior orthopedic surgeon specializing in bone fractures, joint replacements, and sports injury rehabilitation.',
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Sneha Reddy',
    qualification: 'MBBS, DNB (Orthopedics)',
    experience: 11,
    phone: '+91-90000-10006',
    email: 'sneha.reddy@example.com',
    consultationFee: 650,
    specialization: 'Orthopedic',
    gender: 'Female',
    biography: 'Orthopedic specialist with expertise in arthritis treatment, spine health, chronic joint pain, and osteoporosis.',
    profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300'
  },
  // 4. Gynecologist
  {
    name: 'Dr. Anitha Kumar',
    qualification: 'MBBS, MD (Obstetrics & Gynecology)',
    experience: 16,
    phone: '+91-90000-10007',
    email: 'anitha.kumar@example.com',
    consultationFee: 700,
    specialization: 'Gynecologist',
    gender: 'Female',
    biography: 'Comprehensive women healthcare specialist with expertise in pregnancy care, PCOS/PCOD management, and laparoscopic procedures.',
    profileImage: 'https://images.unsplash.com/photo-1582971805810-b24306e0aaa6?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Divya Shah',
    qualification: 'MBBS, DGO (Gynecology)',
    experience: 12,
    phone: '+91-90000-10008',
    email: 'divya.shah@example.com',
    consultationFee: 650,
    specialization: 'Gynecologist',
    gender: 'Female',
    biography: 'Specializing in maternal care, high-risk pregnancy monitoring, menstrual disorders, and adolescent gynecological health.',
    profileImage: 'https://images.unsplash.com/photo-1594824813566-7885a3961cdc?auto=format&fit=crop&q=80&w=300'
  },
  // 5. ENT Specialist
  {
    name: 'Dr. Suresh Balan',
    qualification: 'MBBS, MS (ENT)',
    experience: 13,
    phone: '+91-90000-10009',
    email: 'suresh.balan@example.com',
    consultationFee: 600,
    specialization: 'ENT Specialist',
    gender: 'Male',
    biography: 'ENT surgeon expert in treating chronic ear infections, sinus issues, nasal polyps, and throat disorders.',
    profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Nisha Verma',
    qualification: 'MBBS, DLO (ENT)',
    experience: 8,
    phone: '+91-90000-10010',
    email: 'nisha.verma@example.com',
    consultationFee: 550,
    specialization: 'ENT Specialist',
    gender: 'Female',
    biography: 'ENT specialist focusing on hearing loss evaluation, respiratory allergy management, vertigo, and sleep apnea.',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  // 6. Dermatologist
  {
    name: 'Dr. Rohan Kapoor',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 10,
    phone: '+91-90000-10011',
    email: 'rohan.kapoor@example.com',
    consultationFee: 650,
    specialization: 'Dermatologist',
    gender: 'Male',
    biography: 'Consultant dermatologist specializing in severe acne treatments, skin allergies, hair loss therapies, and eczema.',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Kavya Iyer',
    qualification: 'MBBS, DVD (Dermatology)',
    experience: 7,
    phone: '+91-90000-10012',
    email: 'kavya.iyer@example.com',
    consultationFee: 600,
    specialization: 'Dermatologist',
    gender: 'Female',
    biography: 'Expert in anti-aging treatments, cosmetic dermatology, laser procedures, and complex skin infection therapies.',
    profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300'
  },
  // 7. Cardiologist
  {
    name: 'Dr. Vivek Rao',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience: 18,
    phone: '+91-90000-10013',
    email: 'vivek.rao@example.com',
    consultationFee: 900,
    specialization: 'Cardiologist',
    gender: 'Male',
    biography: 'Senior interventional cardiologist with extensive background in heart failure, hypertension, ECG evaluation, and coronary care.',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Neha Krishnan',
    qualification: 'MBBS, MD, DNB (Cardiology)',
    experience: 13,
    phone: '+91-90000-10014',
    email: 'neha.krishnan@example.com',
    consultationFee: 850,
    specialization: 'Cardiologist',
    gender: 'Female',
    biography: 'Preventive cardiology specialist focusing on lipid/cholesterol management, chest pain evaluation, and cardiac risk assessment.',
    profileImage: 'https://images.unsplash.com/photo-1582971805810-b24306e0aaa6?auto=format&fit=crop&q=80&w=300'
  },
  // 8. Neurologist
  {
    name: 'Dr. Ajay Menon',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: 17,
    phone: '+91-90000-10015',
    email: 'ajay.menon@example.com',
    consultationFee: 900,
    specialization: 'Neurologist',
    gender: 'Male',
    biography: 'Consultant neurologist with deep specialization in chronic migraine, acute stroke intervention, epilepsy, and nerve disorders.',
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dr. Lakshmi Nair',
    qualification: 'MBBS, MD, DNB (Neurology)',
    experience: 12,
    phone: '+91-90000-10016',
    email: 'lakshmi.nair@example.com',
    consultationFee: 850,
    specialization: 'Neurologist',
    gender: 'Female',
    biography: "Expert neurologist specializing in memory disorders, Alzheimer's, Parkinson's disease, peripheral neuropathy, and tremors.",
    profileImage: 'https://images.unsplash.com/photo-1594824813566-7885a3961cdc?auto=format&fit=crop&q=80&w=300'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healthcare';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await DoctorProfile.deleteMany({});
    await DiagnosticTest.deleteMany({});
    await TestBooking.deleteMany({});
    await Appointment.deleteMany({});
    await Payment.deleteMany({});
    await Report.deleteMany({});
    await Prescription.deleteMany({});
    await Notification.deleteMany({});

    console.log('Purged all collections for a clean seed execution.');

    // 1. Seed Admin Account
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@healthtrack.demo',
      password: 'Admin@123',
      phone: '+1 800-555-0199',
      role: 'ADMIN',
      gender: 'Male',
      address: 'HealthTrack HQ, Medical District, NY'
    });

    // 2. Seed Fictional Demo Patient
    const patientUser = await User.create({
      name: 'Demo Patient',
      email: 'patient@healthtrack.demo',
      password: 'Patient@123',
      phone: '+1 555-019-3344',
      role: 'PATIENT',
      gender: 'Male',
      dateOfBirth: new Date('1992-05-15'),
      address: '742 Evergreen Terrace, Springfield',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    });

    // 3. Seed 16 Fictional Doctors (2 for each of 8 specializations)
    console.log('Seeding 16 specialist doctor accounts...');
    for (const docData of doctorSeedData) {
      const doctorUser = await User.create({
        name: docData.name,
        email: docData.email,
        password: 'Doctor@123',
        phone: docData.phone,
        role: 'DOCTOR',
        gender: docData.gender,
        address: 'HealthTrack Multi-Specialty Hospital',
        profileImage: docData.profileImage
      });

      await DoctorProfile.create({
        userId: doctorUser._id,
        specialization: docData.specialization,
        qualification: docData.qualification,
        experience: docData.experience,
        consultationFee: docData.consultationFee,
        biography: docData.biography,
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hospital: 'HealthTrack Multi-Specialty Clinic',
        rating: 4.9
      });
    }

    // 4. Seed Diagnostic Test Catalog
    const diagnosticTestsData = [
      {
        name: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        description: 'Comprehensive evaluation of red blood cells, white blood cells, platelets, hemoglobin, and hematocrit.',
        price: 350,
        sampleType: 'Blood',
        preparation: 'Fasting for 8 hours required',
        reportTime: '12 Hours'
      },
      {
        name: 'Fasting Blood Glucose (FBG)',
        category: 'Diabetic Profile',
        description: 'Measures blood sugar level after overnight fasting to screen for diabetes or prediabetes.',
        price: 180,
        sampleType: 'Blood',
        preparation: 'Fasting for 10-12 hours mandatory',
        reportTime: '6 Hours'
      },
      {
        name: 'Lipid Profile Comprehensive',
        category: 'Cardiology',
        description: 'Checks Total Cholesterol, HDL, LDL, Triglycerides, and VLDL to assess cardiovascular health risk.',
        price: 550,
        sampleType: 'Blood',
        preparation: 'Fasting for 12 hours required',
        reportTime: '24 Hours'
      },
      {
        name: 'Thyroid Function Test (T3, T4, TSH)',
        category: 'Endocrinology',
        description: 'Evaluates thyroid gland function to detect hypothyroidism or hyperthyroidism.',
        price: 650,
        sampleType: 'Blood',
        preparation: 'No specific fasting needed',
        reportTime: '24 Hours'
      },
      {
        name: 'Liver Function Test (LFT)',
        category: 'Biochemistry',
        description: 'Measures ALT, AST, Bilirubin, Alkaline Phosphatase, and Total Protein for liver wellness.',
        price: 600,
        sampleType: 'Blood',
        preparation: 'Avoid alcohol 24 hours prior',
        reportTime: '24 Hours'
      },
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        category: 'Diabetic Profile',
        description: 'Provides average blood sugar levels over the past 2 to 3 months.',
        price: 450,
        sampleType: 'Blood',
        preparation: 'No fasting required',
        reportTime: '12 Hours'
      },
      {
        name: 'Vitamin D (25-Hydroxy)',
        category: 'Vitamins',
        description: 'Assesses Vitamin D levels essential for bone density and immune health.',
        price: 850,
        sampleType: 'Blood',
        preparation: 'No special preparation',
        reportTime: '36 Hours'
      },
      {
        name: '12-Lead Electrocardiogram (ECG)',
        category: 'Cardiology',
        description: 'Non-invasive test recording electrical activity of the heart to check rhythm and ischemia.',
        price: 400,
        sampleType: 'In-clinic',
        preparation: 'Wear loose comfortable clothing',
        reportTime: 'Immediate'
      }
    ];

    await DiagnosticTest.insertMany(diagnosticTestsData);

    // Initial Patient Welcome Notification
    await Notification.create({
      userId: patientUser._id,
      title: 'Welcome to HealthTrack!',
      message: 'Your patient portal is active. You can browse diagnostic packages or schedule appointments with our 16 specialist doctors.',
      type: 'SYSTEM',
      isRead: false
    });

    console.log('----------------------------------------------------');
    console.log('Database Seeding Completed Successfully!');
    console.log('Admin Creds  : admin@healthtrack.demo / Admin@123');
    console.log('Patient Creds: patient@healthtrack.demo / Patient@123');
    console.log('Doctor Creds : arun.kumar@example.com / Doctor@123 (plus 15 other doctors)');
    console.log('Total Doctors Seeded: 16 (2 for each of 8 specializations)');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDB();
