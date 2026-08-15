import { APP_NAME } from './app-contract'
import './App.css'

function App() {
  return (
    <main className="shell">
      <section className="welcome" aria-labelledby="app-title">
        <p className="eyebrow">04–04–04–04</p>
        <h1 id="app-title">{APP_NAME}</h1>
        <p className="intro">Спокійний ритм дихання починається з одного натискання.</p>
        <button className="start-button" type="button">
          Почати
        </button>
      </section>
    </main>
  )
}

export default App
