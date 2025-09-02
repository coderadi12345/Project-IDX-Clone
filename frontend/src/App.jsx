import './App.css'
import usePing from './hooks/queries/usePing'
function App() {
  
  const {isLoading , data} = usePing()

  if(isLoading){
    return (
      <>
      Loading...
      </>
    )
  }
  

  return (
    <>
      Hello {data.message}
    </>
  )
}

export default App
