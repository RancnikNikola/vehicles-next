import { observer } from "mobx-react"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import vehicleStore from "@/stores/vehicleStore";

const UpdateMake = () => {

    const router = useRouter();
    const { id } = router.query;
    const [ make, setMake ] = useState('');
    const [ abrv, setAbrv ] = useState('');

    const goBack =() => {
        router.back();
    }

    const handleUpdateMake = async (event) => {
        event.preventDefault();
    
        const vehicleMakeData = {
          name: make,
          abrv: abrv,
        };
    
        await vehicleStore.updateMake(id, vehicleMakeData);
    
        // Clear the form
        setMake('');
        setAbrv('');
        router.back();
    };

    useEffect(() => {
        vehicleStore.fetchMakeById(id);
    }, []);

    return (
        <div>
             {/* ovo ubacit u svoju komponentu. cilu formu */}
            <button onClick={goBack}>Go Back</button>
            <h2>Update {vehicleStore.make.name}</h2>
            <form onSubmit={handleUpdateMake}>
                <input
                type="text"
                placeholder={vehicleStore.make.name}
                value={make}
                onChange={(event) => setMake(event.target.value)}
                />
                <input
                type="text"
                placeholder={vehicleStore.make.abrv}
                value={abrv}
                onChange={(event) => setAbrv(event.target.value)}
                />
            <button type="submit">Create</button>
          </form>
        </div>
    )
}

export default observer(UpdateMake);