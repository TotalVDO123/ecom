import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteCustomersStep } from "../steps"

export type DeleteCustomersWorkflowInput = { ids: string[] }

export const deleteCustomersWorkflowId = "delete-customers"
/**
 * This workflow deletes one or more customers.
 */
export const deleteCustomersWorkflow = createWorkflow(
  deleteCustomersWorkflowId,
  (input: WorkflowData<DeleteCustomersWorkflowInput>) => {
    const deletedCustomers = deleteCustomersStep(input.ids)
    const customersDeleted = createHook("customersDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedCustomers, {
      hooks: [customersDeleted],
    })
  }
)
