import { ItemCategory } from "src/item-category/entities"
import { StockMovement } from "./stock-movement.entity"

export class Item {
    id: string 
    category_id: string 
    Category: ItemCategory
    StockMovement: StockMovement
    name: string
    description: string 
    quantity: Number 
    cost: Number 
    date_acquired: Date 
    serial_number: string 
}
