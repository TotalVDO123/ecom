import { transform } from "../transform"
import { StepReturn, WorkflowTransactionContext } from "../type"
import { SymbolInputReference, SymbolWorkflowStepTransformer } from "./symbol"
import { resolveValue } from "./resolve-value"

export function proxify<T>(obj: StepReturn<any>): T {
  return new Proxy(obj, {
    get(target: any, prop: string | symbol): any {
      if (prop in target) {
        return target[prop]
      }

      return transform(target[prop], async function (input, context) {
        const { invoke } = context as WorkflowTransactionContext
        let output =
          target.__type === SymbolInputReference ||
          target.__type === SymbolWorkflowStepTransformer
            ? target.__value
            : invoke?.[obj.__step__]?.output

        output = await resolveValue(output, context)
        output = output?.[prop]

        return output && JSON.parse(JSON.stringify(output))
      })
    },
  }) as unknown as T
}
