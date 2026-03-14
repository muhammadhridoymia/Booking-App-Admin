import AdminPanel from './Pages/Home/home';
import './App.css';
import { AuthProvider } from './Components/Context/context';

function App() {
  return (
    <div>
      <AuthProvider>
         <AdminPanel/>
      </AuthProvider>
    </div>
  );
}

export default App;
