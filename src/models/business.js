let mongoose = require('mongoose');

let Schema = mongoose.Schema;

const businessSchema({
  isActive: { 
    type: Boolean,
    default: true
  },
  name: String,
  legalName: String, // razón social,
  businessType: String, // giro
  rut: String,
  phone: Object,  
	address:{
		street: String,
		number: Number,
		district: String,
		city: String,
    region: String,
    country: String
  },
  email: Object,
  website: String,
  v3: {
    ip: String,
    nodePort: Number,
    webPort: Number,
    url: String,

  },
  admins: {
    description: String ,
    { type: Schema.Types.ObjectId, ref: 'User' }
    
  }
  

}, {timestamps: true});

let Business = mongoose.model('Business', businessSchema);

module.exports = Business;