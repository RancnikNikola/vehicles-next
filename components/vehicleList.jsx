import vehicleStore from "@/stores/vehicleStore";
import { observer } from "mobx-react"
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from '../styles/vehicleList.module.css';

const VehicleList = () => {

    const router = useRouter();

    useEffect(() => {
        vehicleStore.fetchVehicles();
    }, []);

    const deleteMake = async (vehicleId) => {
        await vehicleStore.deleteVehicle(vehicleId);
        router.reload();
      }

    const handleSortOrderChange = (event) => {
        const { value } = event.target;
        vehicleStore.setSortOrder(value);
    };

    const handleFilterChange = (filterValue) => {
        vehicleStore.toggleFilter(filterValue);
    };

    return (
        <div>
            <div className={styles.links}>
                <Link href='/create-make'>Create new Make</Link>
                <Link href='/create-model'>Create new Model</Link>
            </div>
            <h2 className={styles.title}>Vehicle List</h2>

            <select value={vehicleStore.sortOrder} onChange={handleSortOrderChange} className={styles.vehicleOrder}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>


            <div className={styles.checkbox}>
                {
                    vehicleStore.vehicles.map((vehicle) => (
                        <label key={vehicle.id} className={styles.checkboxLabel}>
                        <input
                            className={styles.checkboxInput}
                            type="checkbox"
                            value={vehicle.name}
                            checked={vehicleStore.selectedFilters.includes(vehicle.name)}
                            onChange={() => handleFilterChange(vehicle.name)}
                        />
                        {vehicle.name}
                        </label>
                    ))
                }
            </div>
            <div>
            {
            vehicleStore.filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className={styles.vehicles}>
                    <div className={styles.vehicleLinks}>
                        <h2><Link href={`/vehicle/${vehicle.id}`}>{vehicle.name}</Link></h2>
                        <button onClick={()=> {deleteMake(vehicle.id)}}>Delete</button>
                    </div>
                   
                    {
                        vehicle.vehicleModel.map((model) => (
                            <p key={model.id} className={styles.modelName}>{model.name}</p>
                        ))
                        
                    }
                </div>
            ))
           }
            </div>
        </div>
    )
}

export default observer(VehicleList);