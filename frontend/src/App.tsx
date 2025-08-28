

import './App.css'


import {   Routes, Route } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import { useLocation } from 'react-router-dom';
import Library from './components/Library';
import Navbar from './components/Navbar';
import BookCatalogPage from './components/BooksCatalogPage';

import AuthorDashBoard from './components/AuthorDashBoard';
import AddBookForm from './components/AddBookForm';
import UpdateBookForm from './components/updateBookForm';
import ReadBook from './components/ReadBook';
import Purchase from './components/Purchase';



function App() {
const location = useLocation();
  const hideNavbarPaths = ["/signup", "/signin"];

  return (
    <>
   
   
   {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/"  element={<BookCatalogPage />} />
        <Route path="/author-dashboard"  element={<AuthorDashBoard />} />
        <Route path="/add-book"  element={<AddBookForm />} />
        <Route path="/update-book"  element={<UpdateBookForm />} />
        <Route path="/read/:bookId"  element={<ReadBook />} />
        <Route path="/book/purchase"  element={<Purchase />} />
        
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/library" element={<Library/>} />
      </Routes>
    </>
  )
}

export default App
