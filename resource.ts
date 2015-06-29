
module at {

    'use strict';

    /* tslint:disable:no-any */
    type ResourceClass = angular.resource.IResourceClass<any>;
    type ResourceService = angular.resource.IResourceService;

    /* istanbul ignore next */
    function combineResource(instance: any, model?: any): void {
        angular.extend(instance, instance.$_Resource(model));
    }

    /* istanbul ignore next */
    export class Resource implements angular.resource.IResource<Resource> {
        public $promise : angular.IPromise<Resource>;
        public $resolved : boolean;
        public static get(): Resource { return new Resource(); }
        public static query(): Resource { return new Resource(); }
        public static remove(): Resource { return new Resource(); }
        public static save(): Resource { return new Resource(); }
        public static delete(): Resource { return new Resource(); }
        constructor(model?: any) { combineResource(this, model); }
        public $get(): angular.IPromise<Resource> { return this.$promise; }
        public $query(): angular.IPromise<Resource> { return this.$promise; }
        public $remove(): angular.IPromise<Resource> { return this.$promise; }
        public $save(): angular.IPromise<Resource> { return this.$promise; }
        public $delete(): angular.IPromise<Resource> { return this.$promise; }
    }

    /* istanbul ignore next */
    export class ResourceWithUpdate extends Resource  {
        public $promise : angular.IPromise<ResourceWithUpdate>;
        constructor(model?: any) { super(model); }
        public static update(): ResourceWithUpdate { return new ResourceWithUpdate(); }
        public $update(): angular.IPromise<ResourceWithUpdate> { return this.$promise; }
    }

    export function resource(moduleName: string, className: string): IClassAnnotationDecorator {
        return (Target: any): void => {
            /* tslint:disable:variable-name no-console */
            function resourceClassFactory($resource: ResourceService, ...args: any[]): any {
                const Resource: ResourceClass = $resource(Target.url, Target.params, Target.actions, Target.options);
                return attachInjects(angular.extend(Resource, angular.extend(Target, Resource, {
                    prototype: angular.extend(Resource.prototype, angular.extend(Target.prototype, {
                        $_Resource: Resource
                    }))
                })), ...args);
            }
            resourceClassFactory.$inject = (['$resource']).concat(Target.$inject || []);
            angular.module(moduleName).factory(className, resourceClassFactory);
            angular.module(moduleName).run([className, (cls: any) => {
                console.log(className, cls);
            }]);
        };
    }
    /* tslint:enable:no-any variable-name */

}