import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Plus, Edit2, Trash2, Search, Home, BarChart3, Calendar, Settings, HelpCircle, LogOut, MapPin, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const DashboardStats = ({ cars }) => {
  const totalCars = cars.length;
  const availableCars = cars.filter(car => car.available).length;
  const rentedCars = cars.filter(car => !car.available).length;
  const avgPrice = Math.round(cars.reduce((sum, car) => sum + car.pricePerDay, 0) / cars.length);
  const totalRevenue = cars.filter(car => !car.available).reduce((sum, car) => sum + car.pricePerDay, 0);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Cars</p>
            <p className="text-3xl font-bold text-gray-900">{totalCars}</p>
            <p className="text-xs text-green-600 mt-1">+2 from last month</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Available Cars</p>
            <p className="text-3xl font-bold text-green-600">{availableCars}</p>
            <p className="text-xs text-gray-500 mt-1">{((availableCars/totalCars)*100).toFixed(1)}% of fleet</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Car className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Daily Revenue</p>
            <p className="text-3xl font-bold text-purple-600">${totalRevenue}</p>
            <p className="text-xs text-green-600 mt-1">+12% from yesterday</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Price</p>
            <p className="text-3xl font-bold text-orange-600">${avgPrice}</p>
            <p className="text-xs text-gray-500 mt-1">per day</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentTransactions = ({ cars }) => {
  const rentedCars = cars.filter(car => !car.available);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
      </div>
      
      <div className="space-y-4">
        {rentedCars.slice(0, 5).map((car, index) => (
          <div key={car.number} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{car.name}</p>
                <p className="text-sm text-gray-500">#{car.number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-gray-800">${car.pricePerDay}</p>
              <p className="text-sm text-gray-500">per day</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PopularCars = ({ cars }) => {
  const carTypes = cars.reduce((acc, car) => {
    acc[car.type] = (acc[car.type] || 0) + 1;
    return acc;
  }, {});

  const sortedTypes = Object.entries(carTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Popular Car Types</h3>
      
      <div className="space-y-4">
        {sortedTypes.map(([type, count], index) => {
          const percentage = (count / cars.length) * 100;
          return (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{type}</span>
                <span className="text-sm text-gray-500">{count} cars</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Car Management Components
const CarCard = ({ car, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="bg-blue-100 p-2 rounded-lg">
        <Car className="w-8 h-8 text-blue-600" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(car)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(car.number)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <h3 className="font-semibold text-lg text-gray-800">{car.name}</h3>
    <p className="text-sm text-gray-500 mb-2">#{car.number}</p>
    
    <div className="space-y-1 text-sm text-gray-600 mb-3">
      <div className="flex justify-between">
        <span>Type:</span>
        <span className="font-medium">{car.type}</span>
      </div>
      <div className="flex justify-between">
        <span>Fuel:</span>
        <span className="font-medium">{car.fuelCapacity}</span>
      </div>
      <div className="flex justify-between">
        <span>Transmission:</span>
        <span className="font-medium">{car.transmission}</span>
      </div>
      <div className="flex justify-between">
        <span>Capacity:</span>
        <span className="font-medium">{car.personCapacity}</span>
      </div>
    </div>
    
    <div className="flex justify-between items-center pt-3 border-t">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        car.available 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {car.availability ? 'Available' : 'Rented'}
      </span>
      <span className="font-bold text-lg text-gray-800">${car.pricePerDay}/day</span>
    </div>
  </div>
);

const CarForm = ({ car, onSubmit, onCancel }) => {
          const [formData, setFormData] = useState(car || {
            name: '',
            number: '',
            pricePerDay: '',
            personCapacity: '',
            type: 'Sedan',
            fuelCapacity: '',
            transmission: 'manual',
            availability: true
          });

  const handleSubmit = () => {
    if (!formData.name || !formData.number || !formData.fuelCapacity || !formData.personCapacity || !formData.pricePerDay) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {car ? 'Edit Car' : 'Add New Car'}
        </h2>
        
            <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Nissan GT-R"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Plate Number
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.number}
              onChange={(e) => setFormData({...formData, number: e.target.value})}
              placeholder="e.g., LQ-123"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car Type
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="sport">Sport</option>
              <option value="suv">SUV</option>
              <option value="coupe">Coupe</option>
              <option value="hatchback">Hatchback</option>
              <option value="sedan">Sedan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Capacity
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fuel}
              onChange={(e) => setFormData({...formData, fuelCapacity: e.target.value})}
              placeholder="e.g., 80L"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.transmission}
              onChange={(e) => setFormData({...formData, transmission: e.target.value})}
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Person Capacity
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, personCapacity: e.target.value})}
              placeholder="e.g., 2 People"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Day ($)
            </label>
            <input
              type="number"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({...formData, pricePerDay: parseInt(e.target.value)})}
              placeholder="80"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              className="mr-2"
              checked={formData.available}
              onChange={(e) => setFormData({...formData, availability: e.target.checked})}
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              Available for rent
            </label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {car ? 'Update Car' : 'Add Car'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmation = ({ carNumber, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
    <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Confirm Delete</h2>
      <p className="text-gray-600 text-center mb-6">
        Are you sure you want to delete car with license plate <strong>{carNumber}</strong>?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch cars from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/cars')
      .then(res => setCars(res.data))
      .catch(() => alert('Error fetching cars'));
  }, []);

  // Fetch bookings from backend
  

  const filteredCars = cars.filter(car =>
    car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add car
  const handleAddCar = async (carData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/cars', carData);
      setCars([...cars, res.data]);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding car');
    }
  };

  // Edit car
  const handleEditCar = async (carData) => {
    try {
      const carToEdit = cars.find(car => car.number === editingCar.number);
      const res = await axios.put(`http://localhost:5000/api/cars/${carToEdit._id}`, carData);
      setCars(cars.map(car => car._id === carToEdit._id ? res.data : car));
      setEditingCar(null);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating car');
    }
  };

  // Delete car
  const handleDeleteCar = async (carNumber) => {
    try {
      const carToDelete = cars.find(car => car.number === carNumber);
      await axios.delete(`http://localhost:5000/api/cars/${carToDelete._id}`);
      setCars(cars.filter(car => car._id !== carToDelete._id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting car');
    }
  };

  const startEdit = (car) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCar(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Car Management</h2>
          <p className="text-gray-600 mt-1">Manage your rental fleet</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Car
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars by name, license plate, or type..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{cars.filter(car => car.available).length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Car className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rented</p>
              <p className="text-2xl font-bold text-red-600">{cars.filter(car => !car.available).length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Car className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-purple-600">
                ${Math.round(cars.reduce((sum, car) => sum + car.pricePerDay, 0) / cars.length)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <CarCard
            key={car.number}
            car={car}
            onEdit={startEdit}
            onDelete={(carNumber) => setDeleteConfirm(carNumber)}
          />
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No cars found</h3>
          <p className="text-gray-400">Try adjusting your search terms or add a new car.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <CarForm
          car={editingCar}
          onSubmit={editingCar ? handleEditCar : handleAddCar}
          onCancel={cancelForm}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmation
          carNumber={deleteConfirm}
          onConfirm={() => handleDeleteCar(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

// Main App Component
export default function DrivioDashboard() {
  const [activeSection, setActiveSection] = useState('car-management');
  const [cars, setCars] = useState([
    {
      name: "Nissan GT-R",
      number: "LQ-123",
      type: "Sport",
      fuel: "80L",
      transmission: "Manual",
      capacity: "2 People",
      pricePerDay: 80,
      available: true
    },
    {
      name: "Koenigsegg",
      number: "KG-456",
      type: "Sport",
      fuel: "90L",
      transmission: "Manual",
      capacity: "2 People",
      pricePerDay: 99,
      available: false
    },
    {
      name: "Rolls Royce",
      number: "RR-789",
      type: "Coupe",
      fuel: "100L",
      transmission: "Automatic",
      capacity: "4 People",
      pricePerDay: 96,
      available: true
    },
    {
      name: "BMW X5",
      number: "BMW-001",
      type: "SUV",
      fuel: "85L",
      transmission: "Automatic",
      capacity: "7 People",
      pricePerDay: 120,
      available: false
    },
    {
      name: "Audi A4",
      number: "AUD-202",
      type: "Sedan",
      fuel: "60L",
      transmission: "Automatic",
      capacity: "5 People",
      pricePerDay: 75,
      available: true
    }
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'car-management', label: 'Car Management', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];
  
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings")
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]));
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin"); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">DRIVIO</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </div>
          
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left ${
                    activeSection === item.id
                      ? 'text-white bg-blue-600 rounded-r-full mr-4'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-8">
            Preferences
          </div>
          
          <div className="space-y-1">
            <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 text-left">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
            <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 text-left">
              <HelpCircle className="w-5 h-5 mr-3" />
              Help & Support
            </button>
          </div>
          
          <div className="absolute bottom-4 px-4">
            <button onClick={handleLogout} className="flex items-center py-3 text-gray-600 hover:bg-gray-100 rounded-lg px-2">
              <LogOut className="w-5 h-5 mr-3" />
              Log Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeSection === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-600 mt-1">Welcome back! Here's your rental overview</p>
            </div>
            
            <DashboardStats cars={cars} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTransactions cars={cars} />
              <PopularCars cars={cars} />
            </div>
          </div>
        )}
        
        {activeSection === 'car-management' && (
          <CarManagement />
        )}
        
        
        {activeSection === 'bookings' && (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800">Bookings</h2>
            <p className="text-gray-600 mt-1">Bookings section coming soon...</p>
          </div>
        )}
        
        {activeSection === 'bookings' && (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Bookings</h2>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Recent Bookings</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
              </div>
              
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left">Car</th>
                    <th className="py-3 px-4 text-left">From</th>
                    <th className="py-3 px-4 text-left">To</th>
                    <th className="py-3 px-4 text-left">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-medium">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{b.userId?.name || b.userId?.email}</td>
                      <td className="py-3 px-4">{b.carId?.name}</td>
                      <td className="py-3 px-4">{new Date(b.fromDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{new Date(b.toDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">${b.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}