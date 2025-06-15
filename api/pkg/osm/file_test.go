package osm

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

var xmlContent = `
<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6">
  <bounds minlat="41.3852500" minlon="2.1419500" maxlat="41.4273500" maxlon="2.2263600"/>
  <node id="30237864" lat="41.3903935" lon="2.1525394">
    <tag k="bus" v="yes"/>
    <tag k="name" v="Lorem ipsum"/>
  </node>
  <node id="30238029" lat="41.3947228" lon="2.1614618">
    <tag k="crossing" v="unmarked"/>
    <tag k="crossing:markings" v="no"/>
    <tag k="highway" v="crossing"/>
  </node>
  <node id="30242809" lat="41.3973476" lon="2.1813237"/>
  <node id="30242810" lat="41.3964956" lon="2.1802191"/>
  <relation id="19245480" version="1">
    <member type="way" ref="1394482457" role="from"/>
    <member type="node" ref="247637117" role="via"/>
    <member type="way" ref="450512710" role="to"/>
    <tag k="restriction" v="no_left_turn"/>
    <tag k="type" v="restriction"/>
  </relation>
</osm>
`

func TestReadFileShouldSuccess(t *testing.T) {
	tmpDir := t.TempDir()
	tmpFile, err := os.CreateTemp(tmpDir, "map.xml")

	assert.NoError(t, err, "failed to create temp file")

	defer os.Remove(tmpFile.Name())

	_, err = tmpFile.WriteString(xmlContent)
	assert.NoError(t, err, "failed to write to temp file")

	data, err := ReadFromFile(tmpFile.Name())
	assert.NoError(t, err, "failed to read from file")
	assert.Equal(t, 4, len(data.Nodes))
	assert.Equal(t, 1, len(data.Relations))
}

func TestReadFileShouldFailWhenFileDoesNotExist(t *testing.T) {
	data, err := ReadFromFile("__DO_NOT_USE_THIS_FILE_PATH_OR_YOU_WILL_BE_FIRED")
	assert.Error(t, err, "should fail when file does not exist")
	assert.Nil(t, data)
}

func TestReadFileShouldFailWhenFileIsInvalidXML(t *testing.T) {
	tmpDir := t.TempDir()
	tmpFile, err := os.CreateTemp(tmpDir, "map.xml")

	assert.NoError(t, err, "failed to create temp file")

	defer os.Remove(tmpFile.Name())

	_, err = tmpFile.WriteString("__INVALID_XML")
	assert.NoError(t, err, "failed to write to temp file")

	data, err := ReadFromFile(tmpFile.Name())
	assert.Error(t, err, "expected error when reading from invalid xml")
	assert.Nil(t, data)
	assert.ErrorContains(t, err, "error unmarshalling xml")
}
