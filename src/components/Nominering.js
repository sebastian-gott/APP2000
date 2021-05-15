import React, { useState, useEffect, useRef } from 'react'
import  { db } from "../server/firebase"
import { useAuth } from "../context/authContext";
import { NavLink } from 'react-router-dom';



export default function Nominering(){
    const [brukere, setBruker] = useState("")
    const { nominerBruker, setNominerbar, gjeldeneBruker } = useAuth()
    const fornavnRef = useRef()
    const etternavnRef = useRef()
    const beskrivelseRef = useRef()
    
    useEffect(() => {
        db.collection('BrukerInfo')
        .where("Nominerbar", "==", true)
        .get()
        .then(snapshot => {
          const documents = snapshot.docs.map(doc => doc.data())
          setBruker(documents);
        })
    }, [])

    async function handleSubmit(id){
        //e.preventDefault();
        const brukerFinner = brukere.find(bruker => bruker.id === id)
        await nominerBruker(brukerFinner.Fornavn, brukerFinner.Etternavn, brukerFinner.id )
        await setNominerbar(brukerFinner.id)
        console.log(brukerFinner.Fornavn, brukerFinner.Etternavn, brukerFinner.id)
        window.location.reload()
    }

    return ( 
    <div className="App">
        <div className="row width-margin">
        <h3>Nominér en kandidat</h3>
        <p> Her vises brukere som kan nomineres videre for avsteming.
            <br/>
            Trykk på "nominér" for å nominere en kandidat. Kandidaten vil da bli registrert for avstemming.
            <br/>
            Hvis du ønsker å avgi stemme på en allerede nominert bruker, kan du gå til: 
            {gjeldeneBruker && <a className="nomList" href="/"><NavLink to="/Avstemming"> Avstemming</NavLink></a>}
            </p>
        { brukere && brukere.map(bruker => {
        return(
            <div className="col width-margin m6 card-panel nominerKort" key= {bruker.id} >
                <p ref={ fornavnRef } > { bruker.Fornavn } </p>
                <p ref={ etternavnRef } > { bruker.Etternavn } </p>
                <p ref={ beskrivelseRef } >{ bruker.beskrivelse }</p>
                <button className="float-right btn waves-effect waves-light" onClick= { () => handleSubmit(bruker.id) } >Nominér</button> 
            </div>
        )}
        )
        } 
        </div>
    </div>
     );
}
 

