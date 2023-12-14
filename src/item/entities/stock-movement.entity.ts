import { MovementTypeEnum } from "."
import { Item } from "./item.entity"


export class StockMovement {
    id: string 
    item_id: string 
    item: Item 
    quantity: number 
    movement_type: MovementTypeEnum
    movement_date: Date 
    remarks: string 
}