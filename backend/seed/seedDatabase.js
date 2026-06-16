import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import Cafe from '../models/Cafe.js';
import User from '../models/User.js';

const initialCafes = [
  {
    id: 1,
    name: 'Brazilian Santos',
    brand: 'Tropical Beans',
    description: 'Sabor suave con bajo nivel de acidez y notas dulces',
    origin: 'Brasil',
    roast: 'Claro',
    price: 14.99,
    rating: 4.4,
    votes: 156,
    stock: 100,
    minimumStock: 20,
    available: false,
    imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    brand: 'Café del Valle',
    description: 'Equilibrado con notas de caramelo, nuez y chocolate',
    origin: 'Colombia',
    roast: 'Medio',
    price: 16.5,
    rating: 4.6,
    votes: 189,
    stock: 28,
    minimumStock: 5,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Ethiopian Yirgacheffe',
    brand: 'Premium Roasters',
    description: 'Notas florales y cítricas con cuerpo ligero y elegante',
    origin: 'Etiopía',
    roast: 'Medio',
    price: 18.99,
    rating: 4.8,
    votes: 245,
    stock: 18,
    minimumStock: 5,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Sumatra Mandheling',
    brand: 'Asian Roasters',
    description: 'Cuerpo pesado, terroso y notas de chocolate oscuro intenso',
    origin: 'Indonesia',
    roast: 'Oscuro',
    price: 15.75,
    rating: 4.6,
    votes: 210,
    stock: 89,
    minimumStock: 8,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Guatemalan Antigua',
    brand: 'Maya Coffee',
    description: 'Aroma complejo con toques especiados y ahumados únicos',
    origin: 'Guatemala',
    roast: 'Medio',
    price: 17.25,
    rating: 4.5,
    votes: 132,
    stock: 14,
    minimumStock: 5,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    name: 'Kenya AA',
    brand: 'Safari Beans',
    description: 'Acidez brillante y notas de bayas silvestres frescas',
    origin: 'Kenia',
    roast: 'Claro',
    price: 19.5,
    rating: 4.9,
    votes: 312,
    stock: 96,
    minimumStock: 8,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
  }
];

const waitForMongoReady = async () => {
  if (mongoose.connection.readyState === 1) return;

  await new Promise((resolve, reject) => {
    const conn = mongoose.connection;
    const cleanup = () => {
      conn.removeListener('open', onOpen);
      conn.removeListener('error', onError);
    };

    const onOpen = () => {
      cleanup();
      resolve();
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    conn.once('open', onOpen);
    conn.once('error', onError);
    setTimeout(() => reject(new Error('Timeout waiting for MongoDB connection')), 5000);
  });
};

export const seedDatabase = async () => {
  try {
    await waitForMongoReady();

    const cafesCount = await Cafe.countDocuments();

    if (cafesCount === 0) {
      await Cafe.insertMany(initialCafes);
      console.log('Datos iniciales de cafés poblados');
    } else {
      const cafesMissingInventory = await Cafe.find({
        $or: [
          { stock: { $exists: false } },
          { minimumStock: { $exists: false } }
        ]
      });

      if (cafesMissingInventory.length) {
        await Promise.all(
          cafesMissingInventory.map(async (cafe) => {
            if (cafe.stock === undefined) {
              cafe.stock = cafe.available ? 10 : 0;
            }
            if (cafe.minimumStock === undefined) {
              cafe.minimumStock = 5;
            }
            await cafe.save();
          })
        );
        console.log(`Inventario inicial agregado a ${cafesMissingInventory.length} cafés existentes`);
      }
    }

    const adminEmail = 'admin@cafehub.com';
    const clientEmail = 'cliente@cafehub.com';

    const [adminUser, clientUser] = await Promise.all([
      User.findOne({ email: adminEmail }),
      User.findOne({ email: clientEmail })
    ]);

    if (!adminUser) {
      const hashedPassword = await bcryptjs.hash('Admin123!', 10);
      await User.create({
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
        points: 0
      });
    }

    if (!clientUser) {
      const hashedPassword = await bcryptjs.hash('Cliente123!', 10);
      await User.create({
        email: clientEmail,
        name: 'Cliente Premium',
        password: hashedPassword,
        role: 'client',
        points: 50
      });
    }

    if (!adminUser || !clientUser) {
      console.log('Usuarios de prueba creados: admin@cafehub.com / cliente@cafehub.com');
    }
  } catch (error) {
    console.error('Error creando datos de seed:', error);
  }
};
