import { Company } from '../models/companies.model.js';
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinay.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const createComapny = async (req, res) => {
    const { name } = req.body;

    if (!name) {
      throw new ApiError(400, "Name of a company is not provided")
    }

    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      throw new ApiError(400, "Company Already exists")
    }
  
    const logoLocalPath = req.file;

    if (!logoLocalPath) {
      throw new ApiError(400, "logoLocalPath is not available")
    }

    const logo_url = await uploadOnCloudinary(logoLocalPath)

    if (!logo_url) {
      throw new ApiError(400, "logo_url is not available")
    }

    const company = await Company.create({
       name: name,
       logo_url: logo_url.url
    })

    if (!company) {
      throw new ApiError(400, "logo_url is not available")
    }

    return res.status(201)
              .json(new ApiResponse(200, company, "Company Created successfully"))
}


const getCompanies = async (req, res) => {

  const companies = await Company.find()

  if (!companies) {
    throw new ApiError(400, "logo_url is not available")
  }

  return res.status(201)
            .json(new ApiResponse(200, companies, "Company fetched successfully"))
}

export { createComapny, getCompanies }