// Check string value is not undefined, null, or empty ['']
export const handleUnexceptedStringValue = function(v: string): boolean {
  if (v == undefined) return false
  if (v == null) return false
  if (v == '') return false
  return true
} 

// Check number value is not undefined, null, or isNaN
export const handleUnexceptedNumberValue = function(v: number): boolean {
  if (v == undefined) return false
  if (v == null) return false
  if (isNaN(v)) return false
  return true
}