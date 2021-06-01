import React, { useState, useEffect, useRef } from 'react'
import  { db } from "../server/firebase"
import { useAuth } from "../context/authContext";

export default function Avstemming() {

    const [brukere, setBruker] = useState("")
    const [harStemt, setharStemt] = useState();
    const { stemBruker, brukerHarStemt, gjeldeneBruker } = useAuth()
    const fornavnRef = useRef()
    const etternavnRef = useRef()


    useEffect(() => {
        db.collection('NominerteBrukere')
        .get()
        .then(snapshot => {
          const documents = snapshot.docs.map(doc => doc.data())
          setBruker(documents);
          //console.log(documents)
        })
    }, [])

    useEffect(() => {
        const unsub = db.collection('BrukerInfo').doc(gjeldeneBruker.uid)
        .onSnapshot(function (doc){
            const stemmeSjekk = doc.data().harStemt;
            //console.log(stemmeSjekk)
            if(stemmeSjekk === true){
                setharStemt(stemmeSjekk)
            }
            
        })
        
        return unsub
    }, [])

    

    async function handleSubmit(id) {
        const brukerFinner = brukere.find(bruker => bruker.id === id)
        await stemBruker(brukerFinner.id);
        //console.log(gjeldeneBruker)
        await brukerHarStemt(gjeldeneBruker.uid)
        
    }

    return ( 
    <div className="App">
        <div className="row width-margin">
        <h3>Stem på en kandidat</h3>
        <p>Trykk på "stem" for å stemme på en kandidat. Kandidaten vil da få en stemme</p>
        { brukere && brukere.map(bruker => {
        return(
            <div className="col width-margin m6 card-panel nominerKort" key= {bruker.id} >
                <p ref={ fornavnRef } > { bruker.Fornavn } </p>
                <p ref={ etternavnRef } > { bruker.Etternavn } </p>
                { !harStemt && <button className="float-right btn waves-effect waves-light" onClick= { () => handleSubmit(bruker.id) } >Stem</button>}
                { harStemt && <button className="float-right btn waves-effect waves-light" onClick= { () => handleSubmit(bruker.id) } disabled >Stem</button>}
            </div>
        )}
        )
        }
        </div>
    </div>
     );
}
 
