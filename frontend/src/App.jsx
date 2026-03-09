import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<div>home</div>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
