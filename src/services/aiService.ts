// src/services/aiService.ts
import { supabase } from '../lib/supabase'
import { ScriptRequest } from '../types'

export async function generateScript(request: ScriptRequest): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-script', {
      body: request,
    })

    if (error) {
      console.error('Edge function error:', error)
      throw new Error('Failed to generate script. Please try again.')
    }

    if (!data || !data.script) {
      throw new Error('Invalid response from server')
    }

    return data.script
  } catch (error) {
    console.error('AI Service Error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate script: ${error.message}`)
    }
    throw new Error('Failed to generate script. Please try again.')
  }
}
