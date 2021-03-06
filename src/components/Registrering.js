import React, { useRef, useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { db } from '../server/firebase'


import 'firebase/auth';



export function Registrering() {
  //Referanser til verdier
  const fornavnRef = useRef()
  const etternavnRef = useRef()
  const emailRef = useRef()
  const passordRef = useRef()
  const passordGjRef = useRef()
  
  
  //Setter i bruk useAuth funksjonen i authContext
  const { registrer, sjekkEpost, errors} = useAuth()
  //Feilmelding state som kan settes der feilmeldinger trenges
  const [error, setError] = useState("")
  //Får å disable ulike ting mens siden loader
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false);
  const [emailSjekk, setEmailSjekk] = useState()

  const history = useHistory();
  
  //Sjekker om Eposten har usn.no i seg
  var reg = /^\w+([-+.']\w+)*@(usn.no)/

 function handleChange(e) {
   setChecked(e.target.checked)
   console.log(checked)
  
   
 }
   useEffect(() => {
    db.collection('BrukerInfo')
    .get()
    .then(snapshot => {
        const documents = snapshot.docs.map(doc => doc.data().Email)
        setEmailSjekk(documents)
    })

   }, [])
  //Funksjon som settes for <form> sår kjører når det blir submittet
  async function handleSubmit(e) {
    e.preventDefault()
  //Sjekker hvis Eposten er usn og endrer alt til lowercase
    if(!reg.test(emailRef.current.value.toLowerCase())){
      return setError("Dette er ikke en usn epost")
    }
    //Hvis passord ikke matcher
    if (passordRef.current.value !== passordGjRef.current.value) {
      return setError("Passord matcher ikke")
    }

    if(emailSjekk.includes(emailRef.current.value)){
      return setError("Email allerede i bruk")
    }


  
      //Hvis det ikke er noen feil
      setError("")
      setLoading(true)
      registrer(emailRef.current.value, passordRef.current.value, fornavnRef.current.value, etternavnRef.current.value, checked)
      sjekkEpost()
      setTimeout(() => {
        history.push("/Logginn")
      }, 3000);

 

    
      // Setter en timeout slik at eposten blir lagt i databasen før den forsøker å sende epost
      //Sjekker om eposten finnes og sender en aktiverings epost.
    
  }
      
  
      return ( 
    <div className="App" >
      <div class="row">
            <div className="col s12 offset-m4 m4 card-panel registrerPanel">
                <h2>Registrer</h2>
                {errors && <p>{errors}</p>}
                {error && <p>{error}</p>}
                <form action="" className="col s12" onSubmit= {handleSubmit} >
                    
                        <div className="input-field col s12">
                            <i className="material-icons prefix">person_outline</i>
                            <input type="text" placeholder="Fornavn" ref={fornavnRef} className="validate"/>
                        </div>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">person_outline</i>
                            <input type="text" placeholder="Etternavn" ref={etternavnRef} className="validate" required/>
                        </div>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">mail_outline</i>
                            <input type="email" placeholder="Email" ref={emailRef} className="validate" required/>
                        </div>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">lock_outline</i>
                            <input type="password" placeholder="Passord" ref={passordRef} className="validate" required/>
                        </div>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">lock_outline</i>
                            <input type="password" placeholder="Gjenta Passord" ref={passordGjRef} className="validate" required/>
                        </div>
                    
                    <button disabled={loading} type="submit" className="btn waves-effect waves-light right">Registrer</button>
                  <p>
                    <label>
                      <input type="checkbox" className="filled-in" onChange={handleChange} />
                      <span>Vil du være nominerbar?</span>
                    </label>
                  </p>
                </form>
                <p>Allerede registrert? <Link to="/Logginn">Logg inn</Link></p>
            </div>
          
        </div>
    </div>
     
     );
    }
  
    
export default Registrering;