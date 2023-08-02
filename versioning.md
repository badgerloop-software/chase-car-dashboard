## Solar Car 1 Engineering Dashboard Versioning Guidelines 🧑‍⚖️

1. The Solar Car 1 Engineering Dashboard will adhere to [Semantic Versioning](https://semver.org/) specifications.

2. A version number will, at a minimum[^1], be constructed as follows: \<_MAJOR_>.\<_MINOR_>.\<_PATCH_>, where MAJOR, MINOR, and
   PATCH are non-negative numbers dictated by the following types of changes:
    1. MAJOR - A backwards incompatible API change
    2. MINOR - A backwards compatible functional change
    3. PATCH - A backwards compatible bug fix

3. The following are examples of changes that would warrant an update of each version number:
    1. MAJOR: A change was made to the [`sc1-data-format` submodule](https://github.com/badgerloop-software/sc1-data-format)
       such that an incoming dataset from the solar car, which had been packed according to the definition
       (`format.json`) in the previous state of the submodule, cannot be unpacked effectively in the backend using the
       new definition in the updated submodule. Such a change could include signals being added to, removed from, or
       moved to a new offset within the definition.
    2. MINOR: A new component is added to the front end.
    3. PATCH: A check for bad packets is added to the backend to prevent errors when attempting to unpack them.

4. The versions of the `chase-car-dashboard-frontend`, `chase-car-dashboard-backend`, and
   `chase-car-dashboard-data-generator` packages (the "child packages") shall be versioned separately according to the
   changes made in the respective sections of the project.
    1. These versions will be tracked using the `version` field in the respective child package's `package.json` and
       `package-lock.json` files, and in `setup.py` of the `chase-car-dashboard-backend`.
    2. For a given update that warrants a new version of any child packages, the versions of the `chase-car-dashboard`
       and `chase-car-dashboard-image` packages (the "parent packages") shall be updated as described in item 6 to
       reflect the most significant version update made across the child packages.
    
5. Changes made outside the child packages (e.g. a change to `Dockerfile`) shall only affect the versions of the parent
   packages, which shall be updated according to item 6.

6. For a given non-prerelease version of a parent package, there shall exist a version of the other parent package with
   the same precedence (see link in item 1 for more information about precedence). These equivalent versions shall be
   represented as follows:
    1. An annotated git tag associated with the last commit included in that version shall indicate the full version.
    2. The value of the `version` field in `chase-car-dashboard/package.json` and
       `chase-car-dashboard/package-lock.json` shall reflect the core version of the parent packages.
    3. The tag tied to the `chase-car-dashboard-image` Docker image shall indicate the full version.

[^1]: For a more comprehensive definition of the versioning scheme, see
      [Backus–Naur Form Grammar for Valid SemVer Versions](https://semver.org/#backusnaur-form-grammar-for-valid-semver-versions).

