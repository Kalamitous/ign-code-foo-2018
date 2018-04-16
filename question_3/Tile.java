public class Tile {
	private final int row;
	private final int column;
	private boolean isPothole;
	
	public Tile(int row, int column, boolean isPothole) {
		this.row = row;
		this.column = column;
		this.isPothole = isPothole;
	}
	
	public int getRow() {
		return row;
	}
	
	public int getColumn() {
		return column;
	}
	
	public boolean getPothole() {
		return isPothole;
	}
	
	public void setPothole(boolean isPothole) {
		this.isPothole = isPothole;
	}
}
