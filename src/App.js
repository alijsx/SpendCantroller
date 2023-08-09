import './App.css';
import AuthContextProvider from './context/AuthContext';
import  Routes  from './pages/Routes';

function App() {
  return (
     <AuthContextProvider>
     <Routes />
     </AuthContextProvider>
     
  );
}

export default App;
