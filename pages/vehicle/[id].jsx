import { observer } from "mobx-react"
import { useEffect } from "react";
import { useRouter } from "next/router";
import vehicleStore from "@/stores/vehicleStore";
import Link from "next/link";


const SingleVehiclePage = () => {

    const router = useRouter();
    const { id } = router.query;
    const { vehicle } = vehicleStore;

    const deleteModel = async (vehicleId) => {
        await vehicleStore.deleteVehicleModel(vehicleId);
        router.reload();
      }

    useEffect(() => {
        vehicleStore.fetchVehicleById(id);
    }, [id]);

    return (
        <div>
            <Link href='/'>Go Back</Link>
            <h2>Single Vehicle</h2>
            <Link href={`/create-model`}>Add new Model</Link>
            <h3>{vehicle.name}</h3>
            <Link href={`/update-make/${vehicle.id}`}>Edit Make</Link>
            {
                vehicle.vehicleModel?.map((model) => (
                    <div key={model.id}>
                        <p>{model.name}</p>
                        <Link href={`/update-model/${model.id}`}>Edit Model</Link>
                        <button onClick={()=> {deleteModel(model.id)}}>Delete</button>
                    </div>
                ))
            }
        </div>
    )
}

export default observer(SingleVehiclePage);