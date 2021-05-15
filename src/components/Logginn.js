import React, { useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../context/authContext"


function Logginn(){
      //Referanser til verdier
  const emailRef = useRef()
  const passordRef = useRef()
  //Setter i bruk useAuth funksjonen i authContext
  const { logginn } = useAuth()
  //Feilmelding state som kan settes der feilmeldinger trenges
  const [error, setError] = useState("")
  //Får å disable ulike ting mens siden loader
  const [loading, setLoading] = useState(false)

  const history= useHistory()
  
  //Funksjon som settes for <form> sår kjører når det blir submittet
  async function handleSubmit(e) {
    e.preventDefault()

    
    try {
    
      //Hvis det ikke er noen feil
      setError("")
      setLoading(true)
      await logginn(emailRef.current.value, passordRef.current.value)
      history.push("/")
    } catch {
      //Alle feil som ikke har blitt laget feilmelding til går her
      setError("Innlogging mislykkes")
    }
    //Stopper loadinger etter alt har gått gjennom
    setLoading(false)
  
  }
  

    return ( 
    <div className="App">
        <div class="row">
            <div className="col s12 offset-m4 m4 card-panel">
                <h2>Logg inn</h2>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit} className="col s12">
                    
                        <div className="input-field col s12">
                            <i className="material-icons prefix">mail_outline</i>
                            <input type="email" placeholder="Email" ref={emailRef} className="validate"/>
                        </div>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">lock_outline</i>
                            <input type="password" placeholder="Passord" ref={passordRef} className="validate"/>
                        </div>
                    
                    <button disabled={loading} type="submit" className="btn waves-effect waves-light right">Logg Inn</button>
                </form>
                <p className="">Trenger du bruker? <Link to="/Registrering">Registrer deg</Link></p>
                <p> <Link to="/GlemtPassord">Glemt Passord?</Link></p>
            </div>
        </div>
    </div>
     );
}
 
export default Logginn;