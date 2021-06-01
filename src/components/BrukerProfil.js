import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useHistory } from "react-router-dom"
import { storage, db } from "../server/firebase";



export default function App() {
    const [file, setFile] = useState(null);
    const { uploadBilde } = useAuth();
    const [error, setError] = useState("");
    const [checked, setChecked] = useState(false);
    const [erNominert, setErNominert] = useState()
    //Får å disable ulike ting mens siden loader
    const [loading, setLoading] = useState(false);
    const { gjeldeneBruker, oppdaterMail, oppdaterPassord, oppdaterFNavn, oppdaterENavn, oppdaterNom, oppdaterBeskrivelse, nominerbarDisplay, fornavnDisplay, etternavnDisplay } = useAuth();
    const fornavnRef = useRef()
    const etternavnRef = useRef()
    const emailRef = useRef()
    const passordRef = useRef()
    const passordGjRef = useRef()
    const beskrivelseRef = useRef()
    const nomineringRef = useRef()
    const bildeRef = useRef()
    const history = useHistory()
    const [picUrl, setPicUrl] = useState()

    
   

    storage.ref('brukere/' + gjeldeneBruker.uid + '/profile.jpg').getDownloadURL().then((url) => {
        setPicUrl(url);
        gjeldeneBruker.updateProfile({
          photoURL: picUrl
        })
       })
    
    //Sjekker om Eposten har usn.no i seg
    var reg = /^\w+([-+.']\w+)*@(usn.no)/

  
    function handleChange(e) {
      setFile(e.target.files[0]);
    }
    
    function handleNominer(e){
      setChecked(e.target.checked)
   console.log(checked)
    }

    useEffect(() => {
      const unsub = db.collection('BrukerInfo').doc(gjeldeneBruker.uid)
      .onSnapshot(function (doc){
          const nomSjekk = doc.data().Nominert;
          //console.log(stemmeSjekk)
          if(nomSjekk === true){
              setErNominert(nomSjekk)
          }
          return unsub
      })
      
      
  }, [])

//console.log(gjeldeneBruker)
    async function handleSubmit(e) {
      e.preventDefault()
      //Sjekker hvis Eposten er usn og endrer alt til lowercase
      if(!reg.test(emailRef.current.value.toLowerCase())){
        return setError("Dette er ikke en usn epost")
      }

      //Skjekker om passordene er like
      if (passordRef.current.value !== passordGjRef.current.value) {
        return setError("Passord matcher ikke")
      }   
      //Array med regler
      const regler = []
      try {
        setError("")
        setLoading(true) 
              //Skjekker at den nye mailen som blir tastet inn ikke er lik den gjeldene mailen
      if (emailRef.current.value !== gjeldeneBruker.email) {
        //Hvis spørringen over er true blir den nye mailen lagt inn som ny mail i arrayet
       await regler.push(oppdaterMail(emailRef.current.value))
      }
      //Skjekker om passord blir endret hvis det endtres legges det inn i arrayet
      if (passordRef.current.value) {
        await regler.push(oppdaterPassord(passordRef.current.value))
      }
      //Skjekker om Fornavnet blir endret hvis det endtres legges det inn i arrayet
      if (fornavnRef.current.value) {
        await regler.push(oppdaterFNavn(fornavnRef.current.value))
      }
      //Skjekker om Etternavn blir endret hvis det endtres legges det inn i arrayet
      if (etternavnRef.current.value) {
        await regler.push(oppdaterENavn(etternavnRef.current.value))
      }

      if(beskrivelseRef.current.value) {
        await regler.push(oppdaterBeskrivelse(beskrivelseRef.current.value))
      }


        } catch {
          setError("Opplastning mislykkes")
        }
        setLoading(false)
  
      Promise.all(regler)
        //Hvis alle reglene er oppfylt blir man sendt til hjem siden
        .then(() => {
          history.push("/")
        })
        //Hvis reglene ikke oppfylles blir denne errormeldingen sendt
        .catch(() => {
          setError("Mislykket ved oppdatering av profil! Prøv på nytt")
        })
        .finally(() => {
          setLoading(false)
        })
    }

    async function handlePictureUpload(e) {
      await uploadBilde(file)
    }

    async function handleNominationChange(e) {
      e.preventDefault()
      await oppdaterNom(checked)
    }
  
    return (
    <div className="App">
        <div className="row">
        
              <div className="col l2 push-s1 width-margin m5 card-panel myProfile">
                <h3>Profil</h3>
                {gjeldeneBruker.photoURL && <img src={ gjeldeneBruker.photoURL } width="100" height="100" alt="avatar" className="circle z-depth-2"/> }
                <p>Fornavn: {fornavnDisplay}</p>
                <p>Etternavn: {etternavnDisplay}</p>
                <p>Email: {gjeldeneBruker.email}</p>
              </div>
            
            <div className="col s12 offset-m1 m4 card-panel">
            {/*<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js" />*/}

                <h3>Oppdater profil</h3>
                {error && <p>{error}</p>}
                <form action="" className="col s12" onSubmit= {handleSubmit} >
               
                        <div className="input-field col s12">
                            <input 
                              type="text" 
                              placeholder="Fornavn" 
                              ref={fornavnRef} 
                              className="validate"
                            />
                        </div>

                        <div className="input-field col s12">
                            <input 
                              type="text" 
                              placeholder="Etternavn" 
                              ref={etternavnRef} 
                              className="validate"
                            />
                        </div>

                        <div className="input-field col s12">
                            <input 
                              type="text" 
                              placeholder="Beskrivelse"
                              ref={beskrivelseRef} 
                              className="validate"
                            />
                        </div>

                        <div className="input-field col s12">
                            <input 
                              type="email" 
                              defaultValue={gjeldeneBruker.email}
                              ref={emailRef} 
                              className="validate"
                              required
                            />
                        </div>

                        <div className="input-field col s12">
                            <input 
                              type="password" 
                              placeholder="Passord" 
                              ref={passordRef} 
                              className="validate"/>
                        </div>

                        <div className="input-field col s12">
                            <input 
                              type="password" 
                              placeholder="Gjenta Passord" 
                              ref={passordGjRef} 
                              className="validate"
                            />
                        </div>
                        
                        

                        
               
                        {error && <p> {error} </p> }
                        <br></br>
                        
                    
                    <button disabled={loading} type="submit" className="btn waves-effect waves-light right">Oppdater info</button>
                    <Link to="/">Avslutt</Link>
                </form>
                {!erNominert && <form action="" className="col s12" onSubmit={handleNominationChange}>
                <p>
                          <label>
                            <input type="checkbox" className="" onChange={handleNominer} ref={nomineringRef} />
                            { nominerbarDisplay === true && <input type="checkbox" className="filled-in" onChange={handleNominer} ref={nomineringRef} /> }
                            <span>Vil du være nominerbar?</span>
                          </label>
                          <button disabled={loading} type="submit" className="btn waves-effect waves-light right">Endre Nominering</button>
                </p>
                </form>}

                <form action="" className="col s12" onSubmit= {handlePictureUpload}>
                <h5>Last opp/endre profilbilde: </h5>
                        <input type="file" id="imgInp" onChange={handleChange} ref={bildeRef}/>
                        <button disabled={loading} type="submit" className="btn waves-effect waves-light right">Last opp bilde</button>
                </form>
                {/*<img src={gjeldeneBruker.photoURL} width="100" height="100" alt="avatar" className="circle"/>*/}
            </div>
            </div>
        </div>
    );
}