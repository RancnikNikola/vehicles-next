import vehicleStore from "@/stores/vehicleStore";
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";


const CreateModel = () => {

    const [ model, setModel ] = useState('');
    const [ abrv, setAbrv ] = useState('');
    const [ makeId, setMakeId ] = useState('');
    const { makes } = vehicleStore;
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const vehicleModelData = {
          name: model,
          abrv,
          makeId,
        };
    
        await vehicleStore.createVehicleModel(vehicleModelData);
    
        // Clear the form
        setModel('');
        setAbrv('');
        setMakeId('');
        router.push('/');
      };

    useEffect(() => {
        vehicleStore.fetchMakes();
    }, []);

    return (
        <div>
           {/* ovo ubacit u svoju komponentu. cilu formu */}
        <h1>Create new Model</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={model}
              onChange={(event) => setModel(event.target.value)}
            />
            <input
              type="text"
              placeholder="Abbreviation"
              value={abrv}
              onChange={(event) => setAbrv(event.target.value)}
            />
             {/* ovo ubacit u svoju komponentu. cilu select */}
            <select value={makeId} onChange={(event) => setMakeId(event.target.value)}>
              <option value="">Select Vehicle Make</option>
              {makes.map((make) => (
                <option key={make.id} value={make.id}>
                  {make.name}
                </option>
              ))}
            </select>
            <button type="submit">Create</button>
          </form>
        </div>
    )
}

export default observer(CreateModel);