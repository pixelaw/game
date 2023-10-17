import { useDojo } from '@/DojoContext.tsx'
import { useMutation } from '@tanstack/react-query'

type UsePaintCanvasMutationProps = {
  position: [number, number],
  rgbColor: [number, number, number]
}
export function usePaintCanvas(){
  const {
    setup: {
      systemCalls: {put_color},
    },
    account: { account }
  } = useDojo()

  return useMutation({
    mutationKey: ['usePaintCanvas'],
    mutationFn: async ({position, rgbColor}: UsePaintCanvasMutationProps) => put_color(account, position, rgbColor),
    onError: (error) => console.error(`usePaintCanvas Mutation Error: ${error}`)
  })
}
