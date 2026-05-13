// In-memory storage
const storage = {
  Student: [],
  Attendance: [],
  Setting: []
};

// ── Single-result thenable (findOne / findById) ──────────────────────────────
class SingleResultChain {
  constructor(results, ModelClass) {
    this.results = [...results];
    this.ModelClass = ModelClass;
  }
  sort(sortObj) {
    const key = Object.keys(sortObj)[0];
    const order = sortObj[key];
    this.results.sort((a, b) => {
      const av = a[key] instanceof Date ? a[key].getTime() : (a[key] ?? 0);
      const bv = b[key] instanceof Date ? b[key].getTime() : (b[key] ?? 0);
      if (av < bv) return order === -1 ? 1 : -1;
      if (av > bv) return order === -1 ? -1 : 1;
      return 0;
    });
    return this;
  }
  populate(path, fields) {
    if (path === 'student') {
      this.results = this.results.map(item => {
        if (!item || !item.student) return item;
        const s = storage.Student.find(s => String(s._id) === String(item.student));
        if (!s) return item;
        const pop = {};
        if (fields) fields.split(' ').forEach(f => { pop[f] = s[f]; });
        else Object.assign(pop, s);
        return { ...item, student: pop };
      });
    }
    return this;
  }
  then(resolve, reject) {
    try {
      const item = this.results[0];
      resolve(item ? new this.ModelClass(item) : null);
    } catch (e) { reject(e); }
  }
}

// ── Multi-result thenable (find) ─────────────────────────────────────────────
class QueryChain {
  constructor(results, ModelClass) {
    this.results = [...results];
    this.ModelClass = ModelClass;
  }
  sort(sortObj) {
    const key = Object.keys(sortObj)[0];
    const order = sortObj[key];
    this.results.sort((a, b) => {
      const av = a[key] instanceof Date ? a[key].getTime() : (a[key] ?? 0);
      const bv = b[key] instanceof Date ? b[key].getTime() : (b[key] ?? 0);
      if (av < bv) return order === -1 ? 1 : -1;
      if (av > bv) return order === -1 ? -1 : 1;
      return 0;
    });
    return this;
  }
  limit(n) { this.results = this.results.slice(0, n); return this; }
  select() { return this; }
  populate(path, fields) {
    if (path === 'student') {
      this.results = this.results.map(item => {
        if (!item || !item.student) return item;
        const s = storage.Student.find(s => String(s._id) === String(item.student));
        if (!s) return item;
        const pop = {};
        if (fields) fields.split(' ').forEach(f => { pop[f] = s[f]; });
        else Object.assign(pop, s);
        return { ...item, student: pop };
      });
    }
    return this;
  }
  then(resolve, reject) {
    try { resolve(this.results.map(item => new this.ModelClass(item))); }
    catch (e) { reject(e); }
  }
}

// ── Base model ───────────────────────────────────────────────────────────────
class MockModel {
  constructor(modelName, data = {}) {
    this._modelName = modelName;
    this._data = { ...data };
    if (!this._data._id) this._data._id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    if (!this._data.createdAt) this._data.createdAt = new Date();
    if (!this._data.timestamp) this._data.timestamp = new Date();
    Object.assign(this, this._data);
  }

  async save() {
    // Sync any direct property mutations back into _data
    Object.keys(this).forEach(k => { if (!k.startsWith('_')) this._data[k] = this[k]; });
    const idx = storage[this._modelName].findIndex(i => String(i._id) === String(this._data._id));
    const record = { ...this._data };
    if (idx > -1) storage[this._modelName][idx] = record;
    else storage[this._modelName].push(record);
    return this;
  }

  static find(query = {}) {
    const results = storage[this.modelName].filter(item => {
      for (const key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    return new QueryChain(results, this);
  }

  static findOne(query = {}) {
    const results = storage[this.modelName].filter(item => {
      for (const key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    return new SingleResultChain(results, this);
  }

  static findById(id) {
    const results = storage[this.modelName].filter(i => String(i._id) === String(id));
    return new SingleResultChain(results, this);
  }

  static async countDocuments(query = {}) {
    return storage[this.modelName].filter(item => {
      for (const key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    }).length;
  }

  static async findByIdAndUpdate(id, update, opts = {}) {
    const idx = storage[this.modelName].findIndex(i => String(i._id) === String(id));
    if (idx === -1) return null;
    const updated = { ...storage[this.modelName][idx], ...update };
    storage[this.modelName][idx] = updated;
    return new this(opts.new ? updated : storage[this.modelName][idx]);
  }

  static async deleteOne(query = {}) {
    const idx = storage[this.modelName].findIndex(item => {
      for (const key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    if (idx > -1) storage[this.modelName].splice(idx, 1);
    return { deletedCount: idx > -1 ? 1 : 0 };
  }
}

function createMockModel(name) {
  return class extends MockModel {
    static modelName = name;
    constructor(data) { super(name, data); }
  };
}

module.exports = {
  Student: createMockModel('Student'),
  Attendance: createMockModel('Attendance'),
  Setting: createMockModel('Setting'),
  storage
};
