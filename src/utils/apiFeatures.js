class ApiFeatures {
  // query ==> await Product.find();
  // queryString  ==> req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // specific product search() =>
  search() {
    //queryString.keyword => https://example.com/path/to/page?name=ferret&color=purple [here => name and color are keyword]
    const keyword = this.queryString.keyword
      ? {
        name: {
          $regex: this.queryString.keyword,
          $options: "i", // for case insenstiveness
        },
      }
      : {};

    this.query = this.query.find({ ...keyword }); // here query ==> await Product.find(); we know that

    return this;
  }

  // filter() the product ==> filetr work base on category
  filter() {
    const queryCopy = { ...this.queryString }; // making the new object of queryString
    //  Removing some fields for category

    const removeFields = ["keyword", "page", "limit"]; // here we are filtering data based on other query like category , price so we are removing other query => "keyword", "page", "limit"

    removeFields.forEach((key) => delete queryCopy[key]); // remove unwanted query

    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy); // converting to string because we using regex for filter data for price
    // regex => \b => start and end value  || for price : gt --> gretaer then || gte --> gretaer then equal to || lt --> less then || lte --> less then equal to , for finding in range of product.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); // key is given price as qurey {"price":{"gt":"200","lt":"255"}}  : 200 to 245 in btew product require.
    // now mongoose use $ as opretaor so converting it in line 40 : and it will return {"price":{"$gt":"200","$lt":"255"}} $ is for mongoose operator in regex
    this.query = this.query.find(JSON.parse(queryStr)); // now find product in given range : and first convert it string to json using parse

    return this;
  }

  sort() {
    //2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limit() {
    //Limiting
    if (this.queryString.fields) {
      const sortBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(sortBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // Pagintaion =>

  pagination(resultPerPage) {

    // we are shwoing products resulltPrrPage{eg :5 item} in every page
    const currentPage = Number(this.queryString.page) || 1; // if there is no page value in query then show first page
    const skip = resultPerPage * (currentPage - 1); // here lets say we have 50 total product and we are showing 10 product  in one page so if page value is 2 then => 10 * (2-1) =  10, we will skip first 10 product for showing second page
    this.query = this.query.limit(resultPerPage).skip(skip); // limit is query of mongoose set limit to retrun product and skip is how manny starting product we want to skip for next page number
    return this;
  }
}
module.exports = ApiFeatures;
