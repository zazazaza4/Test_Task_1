export const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg"];

export const validateImageType = (value) => {
  if(value) {
    let type = value.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
    return SUPPORTED_FORMATS.includes(type)
  }
}