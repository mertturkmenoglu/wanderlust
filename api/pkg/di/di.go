package di

import "sync"

type ServiceIdentifier string


type Container struct {
	services map[ServiceIdentifier]any
	sync.Mutex
}

func New() *Container {
	return &Container{
		services: make(map[ServiceIdentifier]any),
	}
}

func (c *Container) Set(identifier ServiceIdentifier, instance any) {
	if c == nil {
		return
	}

	c.Lock()
	defer c.Unlock()
	c.services[identifier] = instance
}

func (c *Container) Get(identifier ServiceIdentifier) any {
	if c == nil {
		panic("dependency injection container is nil")
	}

	c.Lock()
	defer c.Unlock()
	svc, ok := c.services[identifier]

	if !ok {
		panic("service not found in container: " + string(identifier))
	}

	return svc
}
