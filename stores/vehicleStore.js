import { makeAutoObservable, runInAction } from "mobx";
import { vehicleDB  } from "@/utils/supabaseClient";

class VehicleStore {
    vehicles = [];  // store all the vehicles with make and models
    vehicle = {}; // current selected vehicle
    filterByName = '';
    sortOrder = 'asc';
    filteredVehicles = [];  // vehicles that we will display, sort and filter them
    selectedFilters = []; // selected filters, ex. 'bmw'
    makes = []; // all the vehicles makes
    make = {};  // current selected make
    models = [];  // all the vehicle models
    model = {};   // current selected model

    constructor () {
        makeAutoObservable(this);
    }

    // Fetch all vehicles with make and models
    async fetchVehicles() {
        try {
            let query = vehicleDB
            .from('vehicleMake')
            .select(`
                id,
                name,
                abrv,
                vehicleModel (
                  id,
                  name,
                  abrv,
                  makeId
                )
            `)
            // Sort vehicles in asc or desc order
            .order('name', { ascending: this.sortOrder === 'asc' })
    
            // Filter vehicles if the checkbox is clicked
            if (this.filterByName)  { 
              query = query.eq('name', this.filterByName) 
            }
    
            const { data } = await query
    
            // Store the vehicles in their variable as well as vehicles to be filtered
            runInAction(() => {
              this.vehicles = data;
              this.filteredVehicles = data;
            })
        } catch (error) {
            console.log('Error fetching vehicles', error);
        }
      }

      // Fetch a single vehicle with make and models based on the given id 
      async fetchVehicleById(vehicleId) {
        try {
          const { data, error } = await vehicleDB
          .from('vehicleMake')
          .select(`
              *,
              vehicleModel (
              *
              )
          `)
          .eq('id', vehicleId)
          .single();
    
          if (error) {
            throw new Error(error.message);
          }
    
          runInAction(() => {
            this.vehicle = data;
          })
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      }

      // Create vehicle make 
      // Insert make directly into the database, no need for pushing the make in the makes array
      // because the vehicles will be fetched again and new created data will be displayed
      async createVehicleMake(vehicleMakeData) {
        try {
          const { error } = await vehicleDB
            .from('vehicleMake')
            .insert([vehicleMakeData]);
    
          if (error) {
            throw new Error(error.message);
          }
        } catch (error) {
          console.error('Error creating vehicle make:', error);
        }
      }

      // fetch vehicle make by its id and store it into the (current) make
      async fetchMakeById(makeId) {
        try {
          const { data, error } = await vehicleDB
          .from('vehicleMake')
          .select(`
              *
          `)
          .eq('id', makeId)
          .single();
    
          if (error) {
            throw new Error(error.message);
          }
    
          runInAction(() => {
            this.make = data;
          })
        } catch (error) {
          console.error('Error fetching make:', error);
        }
      }

      // Update make in database with updated data based on its id
      async updateMake(makeId, updatedData) {
        try {
          const { error } = await vehicleDB
            .from('vehicleMake')
            .update(updatedData)
            .eq('id', makeId)
            .select();
    
          if (error) {
            throw new Error(error.message);
          }
    
          const updatedItemIndex = this.makes.findIndex((make) => make.id === makeId);
    
          if (updatedItemIndex !== -1) {
            this.makes[updatedItemIndex] = { ...this.makes[updatedItemIndex], ...updatedData };
          }
        } catch (error) {
          console.error('Error updating item:', error);
        }
      }

      // fetch all the makes without make models
      // store them in makes array
      async fetchMakes() {
        try {
          const { data, error } = await vehicleDB.from('vehicleMake').select('*');
    
          if (error) {
            throw new Error(error.message);
          }
    
          runInAction(() => {
            this.makes = data;
          })
        } catch (error) {
          console.error('Error fetching vehicle makes:', error);
        }
      }

      // Create new vehicle model to add to any make
      async createVehicleModel(vehicleModelData) {
        try {
          const { data, error } = await vehicleDB
            .from('vehicleModel')
            .insert([vehicleModelData]);
    
          if (error) {
            throw new Error(error.message);
          }
          const newVehicleModel = data;

          runInAction(() => {                
            this.models.push(newVehicleModel);
          })
        } catch (error) {
          console.error('Error creating vehicle model:', error);
        }
      }

      // fetch vehicle model by its id and store it into the (current) model
      async fetchItemModel(modelId) {
        try {
          const { data, error } = await vehicleDB
          .from('vehicleModel')
          .select(`
          *
          `)
          .eq('id', modelId)
          .single();
    
          if (error) {
            throw new Error(error.message);
          }
    
          runInAction(() => {
            this.model = data;
          })
        } catch (error) {
          console.error('Error fetching model:', error);
        }
      }

      // Delete vehicle make based on its id
      // if the vehicle make is deleted, all of its models will be deleted too
      // because database rule is set to cascade delete
      async deleteVehicle(vehicleId) {
        try {
          const { error } = await vehicleDB.from('vehicleMake').delete().eq('id', vehicleId);
    
          if (error) {
            throw new Error(error.message);
          }
    
          this.vehicles = this.vehicles.filter((vehicle) => vehicle.id !== vehicleId);
        } catch (error) {
          console.error('Error deleting vehicle make:', error);
        }
      }
    
      // Delete vehicle model based on it id and only that model will be deleted
      // make and other models will still be present
      async deleteVehicleModel(modelId) {
        try {
          const { error } = await vehicleDB.from('vehicleModel').delete().eq('id', modelId);
    
          if (error) {
            throw new Error(error.message);
          }
    
          this.vehicles = this.vehicles.filter((model) => model.id !== modelId);
        } catch (error) {
          console.error('Error deleting model:', error);
        }
      }

      // function that toggles how you want to filter the items
      // 'bmw', 'audi', or any other make you click (checkbox)
      // can be multiple filters
      toggleFilter(filterValue) {
        if (this.selectedFilters.includes(filterValue)) {
          this.selectedFilters = this.selectedFilters.filter((filter) => filter !== filterValue);
        } else {
          this.selectedFilters.push(filterValue);
        }

        this.filterItems();
      }

      // function that determines will there be filtering based on selected filters array length
      filterItems() {
        if (this.selectedFilters.length === 0) {
          this.filteredVehicles = this.vehicles;
        } else {
          this.filteredVehicles = this.vehicles.filter((vehicle) =>
            this.selectedFilters.includes(vehicle.name)
          );
        }
      }

      // Sort vehicles in asc or desc order by their "make" name
      setSortOrder(sortOrder) {
        this.sortOrder = sortOrder;
        this.fetchVehicles();
      }
}

const vehicleStore = new VehicleStore();
export default vehicleStore;