package pool

import (
	"GUI/simpledtg/src/dtg"
	"math/rand"
)

type DTGPool struct {
	pool map[string]*dtg.DTG
}

func NewPool() *DTGPool {
	return &DTGPool{make(map[string]*dtg.DTG)}
}

func (p *DTGPool) Any() *dtg.DTG {
	for _, v := range p.pool {
		return v
	}

	return nil
}

func (p *DTGPool) Get(id string) (*dtg.DTG, bool) {
	_dtg, ok := p.pool[id]
	return _dtg, ok
}

func (p *DTGPool) Add(_dtg *dtg.DTG) {
	chars := []rune{'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'}

	const idLen = 5

	_id := make([]rune, idLen)
	for i := 0; i < idLen; i++ {
		_id[i] = chars[rand.Intn(len(chars))]
	}

	id := string(_id)

	_dtg.ID = id
	p.pool[id] = _dtg
}

func (p *DTGPool) Remove(id string) {
	delete(p.pool, id)
}
