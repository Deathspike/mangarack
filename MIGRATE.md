## Migration from `MangaRack 3.x` to `MangaRack 4.x`

This document includes notes for migration from `3.x` to `4.x`.

### Changes in Philosophy

#### Depending on visible information

`4.x` aims to provide a normalized and predictable behavior capable of withstanding a changing provider environment. This means that information which is not required to be visible by  the user cannot be depended upon. One of these invisible pieces of information, the chapter tracking identifier, was heavily used in `3.x` to support features such as renaming/repairing and persistent tracking. As a result, these features are no longer supported.

#### Reflecting human behavior

Several popular manga resource providers have been shifting towards a policy which excludes the use of external bots/crawlers/readers. This appears to be mostly focused on large crawlers draining resources (think of crawlers such as Google). However, it is not much of a stretch to imagine that this policy may be extended to include external bots/readers. As a preemptive move, `4.x` aims to act more like a manga-reading human would. This means that series are no longer downloaded in parallel, and in the future, we may need to simulate an actual browser.

#### Predictable behavior

Different configurations and environments make it hard to reason about an application fulfilling a relatively straightforward task. Additional configuration and environment variables create an exponential amount of combinations. To avoid unnecessary complexity in  code maintenance/updates and communication, non-core configurations are dropped in `4.x`. Additionally, people working with technology expect to interact with an application in a recognizable way. This means that the `4.x` branch also normalizes ways of interaction to be more in line with what people expect from it.

### Differences

#### Genres

`3.x` uses the genre naming scheme of the provider. Different providers use different names to indicate the same genre (for example *Oneshot* versus *Oneshots*). `4.x` normalizes the genre names between the different providers and therefore *may* produce a different genre in comparison to `3.x`.

#### Image Formats

`3.x` outputs *bmp*, *gif*, *jpg* or *png* depending on the input format and the active configuration. If an input image does not match one of those known formats, there is no output image. `4.x` takes a different approach; *gif* images are coerced into *jpg* and any other input format that is not *jpg* or *png* is coerced into *png*. Essentially that guarantees that archives only contain *jpg* or *png* images.

#### Deleted Manga

`3.x` never deletes manga, even if it should have been deleted. Instead, it relies on chapter tracking to perform renaming when applicable. As mentioned before, the `4.x` version cannot do this (see *Depending on visible information*), and therefore implements a different manner of synchronization. When manga has been deleted on the provider, it is renamed locally to have a `.cbz.mrdel` extension. You can manually delete these files if you feel they should indeed to be deleted.

### Deprecated Options

#### Disables

##### -a, --animation

Does not meet the *predictable behavior* philosophy. See *Image Formats*.

##### -d, --duplication

Does not meet the *predictable behavior* philosophy.

##### -j, --jacket

Does not meet the *predictable behavior* philosophy.

##### -p, --persistent

Deprecated feature. Please refer to *Depending on visible information*.

##### -m, --meta

Does not meet the *predictable behavior* philosophy.

#### Filters

##### -c, --chapter

Does not meet the *predictable behavior* philosophy.

##### -v, --volume

Does not meet the *predictable behavior* philosophy.

#### Settings

##### -e, --extension

Does not meet the *predictable behavior* philosophy.

##### -k, --keep-alive

Does not meet the *predictable behavior* philosophy.

##### -o, --output <s>

Does not meet the *predictable behavior* philosophy. Use the [working directory](https://en.wikipedia.org/wiki/Working_directory).

##### -s, --source

Does not meet the *predictable behavior* philosophy. Use the [stdin](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_.28stdin.29).

##### -t, --transform <s>

Deprecated feature. See *Image Formats*.

##### -w, --workers <n>

Deprecated feature. Please refer to *Reflecting human behavior*.
