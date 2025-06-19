import { useEffect, useState } from "react";
import { Car, Calendar, Users, Fuel, Settings, MapPin, Star, Clock , LogOut} from "lucide-react";

// Import the actual libraries (you need to install these)
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch {
    return null;
  }
};

const UserDashboard = () => {
  const [cars, setCars] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const userId = getUserIdFromToken();
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/api/cars");
        setCars(response.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load cars. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
      if (!userId) {
          console.error("User ID not found in token");
          return;
      }
      axios
        .get(`http://localhost:5000/api/bookings/user/${userId}`)

        .then((res) => {setBookings(res.data) ;})
        .finally(() => setLoading(false));
    },[bookings] ); 

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin"); 
  };

  const handleBooking = async (carId, carName, pricePerDay) => {
    // Check if user is logged in
    if (!userId) {
      alert("Please log in to make a booking");
      return;
    }

    if (!fromDate || !toDate) {
      alert("Please select booking dates");
      return;
    }

    if (new Date(fromDate) >= new Date(toDate)) {
      alert("To date must be after from date");
      return;
    }

    setBookingLoading(carId);
    
    try {
      const days = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24));
      const totalCost = days * pricePerDay;
      
      // Make sure we have valid numbers
      if (isNaN(totalCost) || totalCost <= 0) {
        throw new Error("Invalid cost calculation");
      }
      
      await axios.post("http://localhost:5000/api/bookings", {
        userId,
        carId,
        fromDate,
        toDate
      });
      
      alert(`${carName} booked successfully! Total cost: ${totalCost} for ${days} day(s)`);
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Booking failed";
      alert(errorMessage);
    } finally {
      setBookingLoading(null);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "suv": return "🚙";
      case "sedan": return "🚗";
      case "hatchback": return "🚕";
      case "sport": return "🏎️";
      case "coupe": return "🚘";
      default: return "🚗";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "suv": return "bg-blue-100 text-blue-800";
      case "sedan": return "bg-indigo-100 text-indigo-800";
      case "hatchback": return "bg-sky-100 text-sky-800";
      case "sport": return "bg-cyan-100 text-cyan-800";
      case "coupe": return "bg-blue-200 text-blue-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCars = selectedType === "all" 
    ? cars 
    : cars.filter(car => car.type === selectedType);

  const carTypes = ["all", ...new Set(cars.map(car => car.type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Car className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
            <Car className="h-8 w-8 text-white" />
            </div>
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Car Rental</h1>
            <p className="text-gray-600">Find your perfect ride</p>
            </div>
        </div>

        <button onClick={handleLogout} className="flex items-center py-3 text-gray-600 hover:bg-gray-100 rounded-lg px-2">
              <LogOut className="w-5 h-5 mr-3" />
              Log Out
            </button>
        </div>

          {/* Date Selection */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Select Your Rental Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {carTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                } border border-blue-200`}
              >
                {type === "all" ? "All Vehicles" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 overflow-hidden ${
                !car.availability ? "opacity-60" : ""
              }`}
            >
              {/* Car Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                      {car.number}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {getTypeIcon(car.type)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(car.type)}`}>
                    {car.type.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    car.availability 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {car.availability ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Car Specs */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{car.personCapacity}</p>
                    <p className="text-xs text-gray-500">Seats</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Fuel className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{car.fuelCapacity}L</p>
                    <p className="text-xs text-gray-500">Tank</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {car.transmission === "automatic" ? "Auto" : "Manual"}
                    </p>
                    <p className="text-xs text-gray-500">Trans.</p>
                  </div>
                </div>
              </div>

              {/* Price and Booking */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${car.pricePerDay}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/day</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(car._id, car.name, car.pricePerDay)}
                  disabled={!car.availability || bookingLoading === car._id || !fromDate || !toDate}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    !car.availability || !fromDate || !toDate
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : bookingLoading === car._id
                      ? "bg-blue-500 text-white cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {bookingLoading === car._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Booking...
                    </>
                  ) : !car.availability ? (
                    "Unavailable"
                  ) : !fromDate || !toDate ? (
                    "Select Dates First"
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      Book Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}

       {
       <div>
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Car</th>
              <th className="py-2 px-4 text-left">From</th>
              <th className="py-2 px-4 text-left">To</th>
              <th className="py-2 px-4 text-left">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="py-2 px-4">{b.carId?.name}</td>
                <td className="py-2 px-4">{new Date(b.fromDate).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(b.toDate).toLocaleDateString()}</td>
                <td className="py-2 px-4">${b.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
      }
      </div>
    </div>
  );
};

export default UserDashboard;