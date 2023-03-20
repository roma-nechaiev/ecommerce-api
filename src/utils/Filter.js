class Filter {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  searchByKeyword() {
    const keyword = this.queryParams.keyword
      ? {
        name: {
          $regex: this.queryParams.keyword,
          $options: 'i',
        },
      }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryObj = { ...this.queryParams };
    const removeFields = ['keyword', 'limit', 'page', 'sort'];
    removeFields.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  paginate() {
    const page = this.queryParams.page || 1;
    const limit = this.queryParams.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
}

module.exports = Filter;
