import vehicleStore from "@/stores/vehicleStore";
import { observer } from "mobx-react-lite"
import { useRouter } from "next/router";
import { useState } from "react";


const CreateMake = () => {

    const router = useRouter();
    const [ make, setMake ] = useState('');
    const [ abrv, setAbrv ] = useState('');


    const handleSubmitMake = async (event) => {
        event.preventDefault();
    
        const vehicleMakeData = {
          name: make,
          abrv: abrv,
        };
    
        await vehicleStore.createVehicleMake(vehicleMakeData);
    
        // Clear the form
        setMake('');
        setAbrv('');
        router.push('/');
    };

    const goBack = () => {
        router.back();
    }


    return (
        <div>
              {/* ovo ubacit u svoju komponentu. cilu formu */}
            <h2>Create Make</h2>
            <button onClick={goBack}>Go Back</button>
            <form onSubmit={handleSubmitMake}>
                <input
                type="text"
                placeholder="Name"
                value={make}
                onChange={(event) => setMake(event.target.value)}
                />
                <input
                type="text"
                placeholder="Abbreviation"
                value={abrv}
                onChange={(event) => setAbrv(event.target.value)}
                />
            <button type="submit">Create</button>
          </form>
        </div>
    )
}

export default observer(CreateMake);