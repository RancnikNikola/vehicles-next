import { observer } from "mobx-react"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import vehicleStore from "@/stores/vehicleStore";
import { vehicleDB } from "@/utils/supabaseClient";
import { toJS } from "mobx";

const UpdateModel = () => {

    const [name, setName] = useState('');
    const [abrv, setAbrv] = useState('');

    const router = useRouter();
    const { id } = router.query;

    const { model } = vehicleStore;

    useEffect(() => {
        vehicleStore.fetchItemModel(id);
    }, [id]);


    const handleSubmitMake = async (event) => {
        event.preventDefault();
    
        // Update the item in Supabase
        const { error } = await vehicleDB
          .from('vehicleModel')
          .update({ name, abrv })
          .eq('id', id);
    
        if (error) {
          console.error('Error updating model:', error.message);
        } else {
          console.log('Model updated successfully');
          router.back();
        }
      };

    return (
        <div>
            <h1>Update {model.name}</h1>
             {/* ovo ubacit u svoju komponentu. cilu formu */}
            <form onSubmit={handleSubmitMake}>
                <input
                    type="text"
                    placeholder={model.name}
                    value={name} onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={model.abrv}
                    value={abrv} onChange={(e) => setAbrv(e.target.value)}
                />
                <button type="submit">Update</button>
          </form>
        </div>
    )

}

export default observer(UpdateModel);